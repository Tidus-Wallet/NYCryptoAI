import { MMKVLoader } from 'react-native-mmkv-storage'

const storage = new MMKVLoader().withEncryption().initialize()

export default storage
