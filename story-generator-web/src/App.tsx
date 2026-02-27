import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import HomePage from '@/pages/HomePage'

const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'))
const EditorPage = lazy(() => import('@/pages/EditorPage'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-3">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full" role="status" aria-label="載入中" />
        <p className="text-sm text-muted-foreground">載入中...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
