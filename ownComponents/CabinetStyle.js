//import { Colors, } from 'react-native/Libraries/NewAppScreen';
import { StyleSheet, } from 'react-native';

const styles = StyleSheet.create({
  CabinetScreen: {
    backgroundColor: '#ccceeb',
  },
  CabinetScreenTitle: {
    fontFamily: 'sans-serif-condensed',
  },
  CabinetScreenContent: {
    flex:1,
    alignItems: 'center',
  },
  ViewTextLbl: {
    flexDirection: 'row',
  },
  text_info1: {
    width: 220,
    textAlignVertical: 'center',
    paddingLeft: 10,
    fontFamily: 'sans-serif-condensed',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#c1c4bb',
  },
  text_info2: {
    width: 150,
    paddingLeft: 4,
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    textAlignVertical: 'center',
    backgroundColor: '#e7efd4',
    color: '#111422',
  },
  input: {
    width: 370,
    height: 40,
    padding: 5,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 15,
  },
  sendBtn: {
    width: 370,
    marginBottom: 10,
  },
  TextCurrentInfo: {
    width: 370, marginTop: 15, textAlign: 'center',
  },
});

export default styles;
