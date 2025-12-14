export function Header() {
  return (
    <header className='w-full bg-background border-b'>
      <div className='px-4 py-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Pathfinding Visualizer</h1>
        <a
          href='https://www.tlouvet.com'
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1.5 group'
        >
          Made by <span className='font-semibold'>TLouvet</span>
          <svg
            className='w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
          </svg>
        </a>
      </div>
    </header>
  );
}
