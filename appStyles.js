import { Colors, } from 'react-native/Libraries/NewAppScreen';
import { StyleSheet, } from 'react-native';

const styles = StyleSheet.create({
  RegScreen: {
    backgroundColor: '#c0f0ce',
  },
  RegScreenTitle: {
    fontFamily: 'sans-serif-condensed', // normal, notoserif, sans-serif, sans-serif-light, sans-serif-thin, sans-serif-condensed, sans-serif-medium, serif, Roboto, monospace
  },
  container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#ecf0f1',
  },
  text_info: {
    width: 300,
    height: 55,
    paddingBottom: 5,
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    backgroundColor: '#e7efd4',
  },
  input: {
      width: 300,
      height: 44,
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: 'blue',
      borderRadius: 15,
  },
  flat_container: {
      flex: 1,
      //position: 'absolute',
      //top: 40,
    },
  flat_touchable: {
      backgroundColor: '#e5c5f7',
      width: 290,
      //textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 5,
      borderColor: 'lightblue',
      marginVertical: 2,
      borderRadius: 10,
  },
  flat_hiden: {
    height: 40,
    marginHorizontal: 2,
    top: 8,
  },
  flat_swipe: {
    textAlign: 'center',
    width: 290,
  },
  flat_username: {
    fontSize: 22,
    fontFamily: 'sans-serif-condensed',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  flat_delBtn: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flat_loginBtn: {
    width: 300,
    marginBottom: 10,
  },
  imagestyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#d4dab8',
  }
});

export default styles;
