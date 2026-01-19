import React from 'react'
import { Container, Bar, Section } from 'react-simple-resizer'
import useMedia from 'use-media'

interface LayoutProps {
  header: React.ReactNode
  left: React.ReactNode
  right: React.ReactNode
  aiChat?: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { header, left, right, aiChat } = props
  const isWide = useMedia({ minWidth: '800px' })
  const isExtraWide = useMedia({ minWidth: '1400px' })
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 shadow-md z-10">{header}</header>
      <div className="flex-grow h-full overflow-hidden flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <Container vertical={!isWide} className="flex-1 h-full overflow-hidden">
            <Section>{left}</Section>
            <Bar size={10} className="bg-dark-700" />
            <Section>{right}</Section>
          </Container>
          {aiChat && isExtraWide && (
            <>
              <Bar size={10} className="bg-dark-700" />
              <div className="w-[420px] flex-shrink-0">{aiChat}</div>
            </>
          )}
        </div>
        {aiChat && !isExtraWide && (
          <div className="h-[400px] flex-shrink-0 border-t border-gray-200">{aiChat}</div>
        )}
      </div>
    </div>
  )
}
