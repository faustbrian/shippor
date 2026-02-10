import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShipmentSummaryCard } from '../../components/ShipmentSummaryCard';
import { filterShippingMethodsByType, getShippingMethodValidationErrors } from '../../domain/shippingMethods';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';

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

  useEffect(() => {
    void loadShippingMethods();
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
                void loadShippingMethods();
              }}
            />
            <SecondaryButton
              label="Cheapest"
              onPress={() => {
                setSortShippingMethodsState('price');
                void loadShippingMethods();
              }}
            />
          </View>
        </SectionCard>

        {visibleMethods.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => {
              setDraft({ ...draft, selectedMethod: method, pickupLocationId: null });
              setShippingMethodError(undefined);
              setPickupError(undefined);
            }}
            style={{
              borderWidth: 1,
              borderColor: draft.selectedMethod?.id === method.id ? '#0A66FF' : '#D0D5DD',
              borderRadius: 12,
              padding: 12,
              marginBottom: 8,
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ fontWeight: '700' }}>{method.label}</Text>
            <Text>{method.carrier} - {method.eta}</Text>
            <Text>${method.price.toFixed(2)}</Text>
          </Pressable>
        ))}

        <SectionCard>
          <Text>Selected: {draft.selectedMethod?.label ?? 'None'}</Text>
          <ErrorText text={shippingMethodError} />
        </SectionCard>

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
        <ShipmentSummaryCard draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}
