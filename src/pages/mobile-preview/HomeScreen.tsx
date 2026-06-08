import type { ActiveTab } from '../MobileAppPreview'

export function HomeScreen({ onNavigate }: { onNavigate: (tab: ActiveTab) => void }) {
  void onNavigate
  return <div className="p-6">Home (stub)</div>
}
