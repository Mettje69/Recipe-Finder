import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RecipeFinder from './components/RecipeFinder'
import AddRecipeForm from './components/AddRecipeForm'
import Header from './components/Header'
import Register from './components/Register'
import Login from './components/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/register" />;
};

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box minH="100vh" bg="gray.50" w="100%" maxW="100%" overflowX="hidden">
            <Header />
            <Box className="content-container" w="100%" overflowX="hidden" p={4}>
              <Routes>
                <Route path="/" element={<RecipeFinder />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/add"
                  element={
                    <ProtectedRoute>
                      <AddRecipeForm />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
