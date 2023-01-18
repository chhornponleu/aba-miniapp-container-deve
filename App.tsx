import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Linking, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';


const script = `
  const host = window.ReactNativeWebView || window.parent;
  window.AbaPayway = {
    miniApp: (data) =>{
      host.postMessage(JSON.stringify({data,'event':'miniApp'},null,2))
    },
    miniAppGetProfile : (callback = ()=>{})=> {
      callback({
          "firstName": "John",
          "middleName": "Unknown",
          "lastName": "Doe",
          "fullName": "",
          "sex": "M",
          "dobShort": "DD-MM",
          "nationality": "KHM",
          "phone": "+85512345678",
          "email": "",
          "lang": "en",  
          "id": "123456",  
          "appVersion": "4.9.12",
          "osVersion": "14.7.1"
      })
    }
  }
`
const defaultUrl = 'mywhateverurl';
export default function App() {
  const [url, setUrl] = useState(defaultUrl);
  const [tmpUrl, setTmpUrl] = useState('');
  const [mv, setMv] = useState(false);
  const [p, setP] = useState<{ merchantName?: string; barTitle?: { title?: string; color?: string, bgColor?: string; }, safeAreaColor?: string }>({ safeAreaColor: 'white' });
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: p.safeAreaColor }]}>
      <View style={{ backgroundColor: p?.barTitle?.bgColor?.replace('##', '#') || 'red', height: 50, alignItems: 'center', paddingHorizontal: 16, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: p.barTitle?.color || 'black', fontSize: 18, fontWeight: 'bold' }}>{p?.barTitle?.title || p.merchantName}</Text>
        </View>
        <TouchableOpacity onPress={() => {
          setMv(true);
          setTmpUrl(url)
        }}><Text style={{ color: p.barTitle?.color || 'black' }}>ooo</Text></TouchableOpacity>
      </View>
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled={true}
        onMessage={(e) => {
          const data = JSON.parse(e.nativeEvent.data);
          if (data?.event === 'miniApp') { setP(data.data) }
        }}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url.startsWith('abamobilebank://')) {
            Linking.openURL(url);
            return false;
          }
          return true;
        }}
        injectedJavaScriptBeforeContentLoaded={script}
        source={{ uri: url || defaultUrl }}
        style={{ flex: 1, backgroundColor: '#fff' }}
      />
      <Modal visible={mv}>
        <View style={{ flex: 1, justifyContent: 'center', 'alignItems': 'center' }}>
          <View style={{ width: '100%', padding: 30 }}>
            <TextInput
              autoFocus
              value={tmpUrl}
              onChangeText={text => setTmpUrl(text)}
              placeholder="URL" placeholderTextColor={""}
              selectTextOnFocus
              multiline

              keyboardType="url"
              style={{ width: '100%', minHeight: 80, backgroundColor: 'lightgrey', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16 }}
            />
            <TouchableOpacity onPress={() => {
              setUrl(tmpUrl);
              setMv(false);
            }} style={{ width: '100%', height: 40, backgroundColor: 'blue', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>Go</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => setMv(false)} style={{ width: '100%', height: 40, marginTop: 40, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'black' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
