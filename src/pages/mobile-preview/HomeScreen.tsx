export function HomeScreen({ onNavigate }: { onNavigate: (tab: 'home' | 'jobs' | 'copilot' | 'notifications') => void }) {
  void onNavigate
  return <div className="p-6">Home (stub)</div>
}
