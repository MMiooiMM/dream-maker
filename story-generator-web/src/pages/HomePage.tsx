import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-8 sm:gap-8 sm:p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent leading-tight">
          故事產生器
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          像遊戲一樣，打造你的章節故事
        </p>
      </div>
      <div className="flex w-full sm:w-auto gap-4 justify-center">
        <button
          onClick={() => navigate('/projects')}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          開始創作
        </button>
      </div>
    </div>
  )
}
