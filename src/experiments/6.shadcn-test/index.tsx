import React from 'react'
import { HTMLLayout } from '../../components/layout/html-layout';
import { cn } from '@/lib/utils';
import { DemoCreateAccount } from './cards/create-account';

function DemoContainer({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div
        className={cn(
          "flex items-center justify-center [&>div]:w-full",
          className
        )}
        {...props}
      />
    )
  }

function ShadcnTest() {
  return (
    <>
        <div className="items-start justify-center gap-6 rounded-lg p-8 grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <DemoContainer>
            <DemoCreateAccount />
          </DemoContainer>
        </div>
      </div>
    </>
  )
}

ShadcnTest.Layout = HTMLLayout;
ShadcnTest.Title = 'Shadcn Test';
ShadcnTest.Description = 'Testing Shadcn UI components';
ShadcnTest.Tags = ['ui', 'shadcn'];
ShadcnTest.background = 'dots'; 

export default ShadcnTest;