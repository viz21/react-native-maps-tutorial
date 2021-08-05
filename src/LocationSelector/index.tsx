import React, {FC, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';

interface Props {
  label?: string;
  value?: string;
  onSelect?: (location: any) => void;
}

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const CustomLocationSelector: FC<Props> = props => {
  const {label, value, onSelect} = props;
  const latitudeDelta = 0.015;
  const longitudeDelta = 0.0121;

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta,
    longitudeDelta,
  });

  const [marginTop, setMarginTop] = useState(1);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const checkPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        info => console.log(info),
        error => console.log(new Date(), error),
        {enableHighAccuracy: true, timeout: 10000},
      );
      setIsMapVisible(true);
    }
  };

  const onMapReady = () => {
    setMarginTop(0);
  };

  const onRegionChange = (regionData: Region) => {
    setRegion(regionData);
  };

  const onMarkerMoved = (coordinates: any) => {
    let movedLocation = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta,
      longitudeDelta,
    };
    setRegion(movedLocation);
  };

  const showMap = () => {
    if (Platform.OS === 'android') {
      checkPermission().then();
    } else if (Platform.OS === 'ios') {
      // console.log('ios');
      setIsMapVisible(true);
    }
  };

  return (
    <>
      <View style={styles.recordContainer}>
        <Text style={styles.recordTitle}>{label}</Text>
        <TouchableOpacity onPress={showMap}>
          <TextInput
            multiline={true}
            editable={false}
            style={styles.recordValue}
            value={value}
          />
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isMapVisible}
        onBackButtonPress={() => setIsMapVisible(false)}>
        <View style={styles.container}>
          <View style={{flex: 3}}>
            <MapView
              style={{...styles.map, marginTop: marginTop}}
              initialRegion={region}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              onMapReady={onMapReady}
              onRegionChangeComplete={data => onRegionChange(data)}>
              <MapView.Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                title={'Your Location'}
                draggable
                onDragEnd={e => onMarkerMoved(e.nativeEvent.coordinate)}
              />
            </MapView>
          </View>
          <View style={styles.deatilSection}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'roboto',
                marginBottom: 15,
              }}>
              Move map or long press Marker and move for location
            </Text>
            <Text style={{fontSize: 10, color: '#999'}}>
              LOCATION (Turn on GPS for more accuracy)
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 14,
                paddingVertical: 10,
                borderBottomColor: 'silver',
                borderBottomWidth: 0.5,
                marginBottom: 15,
              }}>
              {region.latitude + ', ' + region.longitude}
            </Text>
            <View style={styles.btnContainer}>
              <Button
                title="PICK THIS LOCATION"
                onPress={() => {
                  onSelect?.(region.latitude + ',' + region.longitude);
                  setIsMapVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomLocationSelector;

const styles = StyleSheet.create({
  recordTitle: {
    color: '#616161',
    fontWeight: 'normal',
    fontSize: 15,
  },
  recordValue: {
    minHeight: 40,
    maxHeight: 500,
    alignItems: 'stretch',
    paddingBottom: 5,
    borderColor: '#90a4ae',
    borderBottomWidth: 1,
    fontSize: 15,
    color: '#455a64',
  },
  recordContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    display: 'flex',
    ...StyleSheet.absoluteFillObject,
  },
  deatilSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  btnContainer: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
});
