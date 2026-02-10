import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { filterShippingMethodsByType, getShippingMethodValidationErrors } from '../../domain/shippingMethods';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { ShippingMethodCard } from '../../components/ShippingMethodCard';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { ShippingMethodInstructionsPanel } from '../../components/ShippingMethodInstructionsPanel';
import { Switch } from 'react-native';
import { ShippingMethodsLoadingPlaceholder } from '../../components/ShippingMethodsLoadingPlaceholder';

type Props = NativeStackScreenProps<SendStackParamList, 'SendMethods'>;

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: active ? '#0A66FF' : '#D0D5DD',
        backgroundColor: active ? '#EEF4FF' : '#fff',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 7,
      }}
    >
      <Text style={{ color: active ? '#0A66FF' : '#344054', fontWeight: '700', fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}

export function SendMethodsScreen({ navigation }: Props) {
  const loadShippingMethods = useAppStore((state) => state.loadShippingMethods);
  const loadPickupLocations = useAppStore((state) => state.loadPickupLocations);
  const setSortShippingMethodsState = useAppStore((state) => state.setSortShippingMethodsState);
  const methods = useAppStore((state) => state.shippingMethods);
  const pickupLocations = useAppStore((state) => state.pickupLocations);
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const [shippingMethodError, setShippingMethodError] = useState<string | undefined>();
  const [pickupError, setPickupError] = useState<string | undefined>();
  const [selectedTab, setSelectedTab] = useState<'all' | 'pickup' | 'home' | 'return'>('all');
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);

  const refreshMethods = () => {
    setIsLoadingMethods(true);
    void loadShippingMethods().finally(() => setIsLoadingMethods(false));
  };

  useEffect(() => {
    const load = async () => {
      setIsLoadingMethods(true);
      await loadShippingMethods();
      setIsLoadingMethods(false);
    };
    void load();
  }, [loadShippingMethods]);

  useEffect(() => {
    if (draft.selectedMethod?.isPickupLocationMethod) {
      void loadPickupLocations(draft.selectedMethod.serviceId);
    }
  }, [draft.selectedMethod, loadPickupLocations]);

  const [homeMethods, pickupMethods, returnMethods] = filterShippingMethodsByType(
    methods,
    false,
    'deliveryTime',
  );
  const visibleMethods =
    selectedTab === 'all'
      ? methods
      : selectedTab === 'pickup'
        ? pickupMethods
        : selectedTab === 'home'
          ? homeMethods
          : returnMethods;

  const renderMethodList = (list: typeof methods, title: string) => {
    if (!list.length) {
      return null;
    }

    return (
      <SectionCard>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#EAECF0',
            paddingBottom: 8,
            marginBottom: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontWeight: '800', fontSize: 13, color: '#344054', letterSpacing: 0.3 }}>
            {title.toUpperCase()}
          </Text>
          <Text style={{ color: '#667085', fontSize: 12 }}>{list.length} option(s)</Text>
        </View>
        {list.map((method) => (
          <ShippingMethodCard
            key={method.id}
            method={method}
            isPickup={method.isPickupLocationMethod}
            selected={draft.selectedMethod?.id === method.id}
            onSelect={() => {
              setDraft({ ...draft, selectedMethod: method, pickupLocationId: null });
              setShippingMethodError(undefined);
              setPickupError(undefined);
            }}
            onConfirm={() => {
              setDraft({ ...draft, selectedMethod: method });
              if (method.isPickupLocationMethod && !draft.pickupLocationId) {
                setPickupError('Select pickup point address');
                return;
              }
              navigation.navigate('SendCart');
            }}
          />
        ))}
      </SectionCard>
    );
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <SendStepHeader currentStep={4} />
        <Heading>Send - Methods</Heading>
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Method type</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <FilterChip label={`All (${methods.length})`} active={selectedTab === 'all'} onPress={() => setSelectedTab('all')} />
            <FilterChip label={`Pickup (${pickupMethods.length})`} active={selectedTab === 'pickup'} onPress={() => setSelectedTab('pickup')} />
            <FilterChip label={`Home (${homeMethods.length})`} active={selectedTab === 'home'} onPress={() => setSelectedTab('home')} />
            <FilterChip label={`Return (${returnMethods.length})`} active={selectedTab === 'return'} onPress={() => setSelectedTab('return')} />
          </View>
        </SectionCard>
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Sort</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <FilterChip label="Fastest" onPress={() => { setSortShippingMethodsState('deliveryTime'); refreshMethods(); }} />
            <FilterChip label="Cheapest" onPress={() => { setSortShippingMethodsState('price'); refreshMethods(); }} />
          </View>
        </SectionCard>
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Additional services (updates method prices)</Text>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Shipment collection service</Text>
              <Switch
                value={Boolean(draft.addons.pickup)}
                onValueChange={(value) => {
                  setDraft({ ...draft, addons: { ...draft.addons, pickup: value } });
                  refreshMethods();
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Doorstep delivery</Text>
              <Switch
                value={Boolean(draft.addons.delivery)}
                onValueChange={(value) => {
                  setDraft({ ...draft, addons: { ...draft.addons, delivery: value } });
                  refreshMethods();
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Delivered by 9 AM</Text>
              <Switch
                value={Boolean(draft.addons.delivery09)}
                onValueChange={(value) => {
                  setDraft({ ...draft, addons: { ...draft.addons, delivery09: value } });
                  refreshMethods();
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Fragile delivery</Text>
              <Switch
                value={Boolean(draft.addons.fragile)}
                onValueChange={(value) => {
                  setDraft({ ...draft, addons: { ...draft.addons, fragile: value } });
                  refreshMethods();
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Dangerous substances</Text>
              <Switch
                value={Boolean(draft.addons.dangerous)}
                onValueChange={(value) => {
                  setDraft({ ...draft, addons: { ...draft.addons, dangerous: value } });
                  refreshMethods();
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Limited quantities</Text>
              <Switch
                value={Boolean(draft.addons.limitedQtys)}
                onValueChange={(value) => {
                  setDraft({ ...draft, addons: { ...draft.addons, limitedQtys: value } });
                  refreshMethods();
                }}
              />
            </View>
          </View>
        </SectionCard>
        {isLoadingMethods ? (
          <>
            <SectionCard>
              <Text style={{ fontWeight: '700' }}>Loading delivery options...</Text>
              <Text>Fetching available methods and prices.</Text>
            </SectionCard>
            <ShippingMethodsLoadingPlaceholder />
          </>
        ) : null}
        {!isLoadingMethods && selectedTab === 'all' ? renderMethodList(pickupMethods, 'To pickup point') : null}
        {!isLoadingMethods && selectedTab === 'all' ? renderMethodList(homeMethods, 'To door') : null}
        {!isLoadingMethods && selectedTab === 'all' ? renderMethodList(returnMethods, 'Return services') : null}
        {!isLoadingMethods && selectedTab !== 'all'
          ? renderMethodList(
              visibleMethods,
              selectedTab === 'pickup'
                ? 'To pickup point'
                : selectedTab === 'home'
                  ? 'To door'
                  : 'Return services',
            )
          : null}
        {!isLoadingMethods && !visibleMethods.length ? (
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>No delivery options found</Text>
            <Text>Try another recipient address, parcel setup, or service tab.</Text>
          </SectionCard>
        ) : null}

        <SectionCard>
          <Text style={{ fontWeight: '800' }}>Selected delivery option</Text>
          <Text style={{ color: '#475467' }}>{draft.selectedMethod?.label ?? 'None'}</Text>
          <ErrorText text={shippingMethodError} />
        </SectionCard>
        <ShippingMethodInstructionsPanel method={draft.selectedMethod} />

        {draft.selectedMethod?.isPickupLocationMethod ? (
          <SectionCard>
            <Label>Select pickup point address</Label>
            {pickupLocations.map((location) => (
              <Pressable
                key={location.id}
                onPress={() => {
                  setDraft({ ...draft, pickupLocationId: location.id });
                  setPickupError(undefined);
                }}
                style={{
                  borderWidth: 1,
                  borderColor: draft.pickupLocationId === location.id ? '#0A66FF' : '#D0D5DD',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 8,
                  backgroundColor: draft.pickupLocationId === location.id ? '#EEF4FF' : '#fff',
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '700' }}>{location.name}</Text>
                  <Text style={{ color: draft.pickupLocationId === location.id ? '#0A66FF' : '#667085', fontWeight: '700', fontSize: 12 }}>
                    {draft.pickupLocationId === location.id ? 'Selected' : 'Choose'}
                  </Text>
                </View>
                <Text style={{ color: '#475467' }}>{location.address1}, {location.zipcode}</Text>
              </Pressable>
            ))}
            <ErrorText text={pickupError} />
          </SectionCard>
        ) : null}

        <PrimaryButton
          label="Next: Cart"
          onPress={() => {
            const errors = getShippingMethodValidationErrors(draft.selectedMethod);
            setShippingMethodError(errors.shippingMethod);
            if (draft.selectedMethod?.isPickupLocationMethod && !draft.pickupLocationId) {
              setPickupError('Select pickup point address');
              return;
            }
            if (!errors.shippingMethod) {
              navigation.navigate('SendCart');
            }
          }}
        />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}
