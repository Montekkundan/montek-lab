import { FC, ReactNode } from 'react'

import { NavigationLayout, NavigationLayoutProps } from './navigation-layout'
import { DotPattern } from '../ui/dot-pattern'

interface HTMLLayoutProps extends NavigationLayoutProps {
  background?: 'white' | 'dots' | 'dots_white' | 'none'
}

export const HTMLLayout: FC<HTMLLayoutProps> = ({
  children,
  title,
  description,
  slug,
  background = 'none'
}) => {
  const isWhiteBackground = background === 'white' || background === 'dots_white';
  const showDots = background === 'dots' || background === 'dots_white';
  
  return (
    <>
      <NavigationLayout title={title} description={description} slug={slug}>
        <div style={{
          position: 'relative',
          backgroundColor: isWhiteBackground ? 'white' : 'transparent',
          color: isWhiteBackground ? 'black' : 'inherit',
          minHeight: '100vh',
          padding: '1rem',
          width: '100%'
        }}>
          {showDots && (
            <DotPattern 
              width={24} 
              height={24} 
              cx={1.5}
              cy={1.5}
              cr={1}
              glow
              className={`opacity-25 ${isWhiteBackground ? 'text-gray-400' : ''}`} 
            />
          )}
          {children}
        </div>
      </NavigationLayout>
    </>
  )
}