import { render, screen } from '@testing-library/react'
import { Button } from '../ui/button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
}) 