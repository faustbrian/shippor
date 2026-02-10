import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { filterShippingMethodsByType, getShippingMethodValidationErrors } from '../../domain/shippingMethods';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { ShippingMethodCard } from '../../components/ShippingMethodCard';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { ShippingMethodInstructionsPanel } from '../../components/ShippingMethodInstructionsPanel';

type Props = NativeStackScreenProps<SendStackParamList, 'SendMethods'>;

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
        <Text style={{ fontWeight: '700' }}>{title}</Text>
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
      <ScrollView>
        <SendStepHeader currentStep={4} />
        <Heading>Send - Methods</Heading>
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Method type</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <SecondaryButton label={`All (${methods.length})`} onPress={() => setSelectedTab('all')} />
            <SecondaryButton label={`Pickup (${pickupMethods.length})`} onPress={() => setSelectedTab('pickup')} />
            <SecondaryButton label={`Home (${homeMethods.length})`} onPress={() => setSelectedTab('home')} />
            <SecondaryButton label={`Return (${returnMethods.length})`} onPress={() => setSelectedTab('return')} />
          </View>
        </SectionCard>
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Sort</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton
              label="Fastest"
              onPress={() => {
                setSortShippingMethodsState('deliveryTime');
                setIsLoadingMethods(true);
                void loadShippingMethods().finally(() => setIsLoadingMethods(false));
              }}
            />
            <SecondaryButton
              label="Cheapest"
              onPress={() => {
                setSortShippingMethodsState('price');
                setIsLoadingMethods(true);
                void loadShippingMethods().finally(() => setIsLoadingMethods(false));
              }}
            />
          </View>
        </SectionCard>
        {isLoadingMethods ? (
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>Loading delivery options...</Text>
            <Text>Fetching available methods and prices.</Text>
          </SectionCard>
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
          <Text>Selected: {draft.selectedMethod?.label ?? 'None'}</Text>
          <ErrorText text={shippingMethodError} />
        </SectionCard>
        <ShippingMethodInstructionsPanel method={draft.selectedMethod} />

        {draft.selectedMethod?.isPickupLocationMethod ? (
          <SectionCard>
            <Label>Pickup point</Label>
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
                  padding: 10,
                  marginBottom: 8,
                  backgroundColor: '#fff',
                }}
              >
                <Text style={{ fontWeight: '700' }}>{location.name}</Text>
                <Text>{location.address1}, {location.zipcode}</Text>
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
