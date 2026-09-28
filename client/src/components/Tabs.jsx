export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="px-4 sm:px-8 relative z-10 border-b border-[#1a2332] shrink-0 bg-[#0c1017]">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`py-2.5 px-3.5 text-[13px] transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 rounded-md font-medium ${
                isActive
                  ? 'text-white bg-[#141d2a] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#111823]'
              }`}
              style={{
                marginBottom: isActive ? '-1px' : undefined,
                borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent'
              }}
            >
              {Icon && (
                <Icon
                  size={15}
                  className={isActive ? 'text-blue-400' : 'text-slate-500'}
                />
              )}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ml-0.5 tabular-nums ${
                  isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-[#182232] text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
