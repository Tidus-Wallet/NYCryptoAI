import { ToastProvider, ToastViewport } from '@tamagui/toast'
import SettingsView from 'components/SettingsView'
import CurrentToast from './CurrentToast'

export default function ModalScreen() {
  return (
    <ToastProvider>
      <SettingsView />
      <CurrentToast />
      <ToastViewport top="$8" left={0} right={0} />
    </ToastProvider>
  )
}
