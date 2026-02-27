import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          故事產生器
        </h1>
        <p className="text-lg text-muted-foreground">
          像遊戲一樣，打造你的章節故事
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          開始創作
        </button>
      </div>
    </div>
  )
}
