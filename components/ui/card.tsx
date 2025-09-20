import * as React from 'react'

import { cn } from '@/lib/utils'

interface CardProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'agricultural'
  interactive?: boolean
}

function Card({ className, variant = 'default', interactive = false, ...props }: CardProps) {
  const variants = {
    default: 'bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl',
    elevated: 'bg-gradient-to-br from-card via-card to-card/95 shadow-xl hover:shadow-2xl border-0',
    outlined: 'bg-card/60 backdrop-blur-md border-2 border-primary/20 shadow-md hover:border-primary/40',
    filled: 'bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-primary/10 shadow-md',
    agricultural: 'bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-lime-50/40 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-lime-950/20 border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg backdrop-blur-sm'
  }

  return (
    <div
      data-slot="card"
      className={cn(
        'relative overflow-hidden rounded-2xl flex flex-col transition-all duration-300 ease-out',
        variants[variant],
        interactive && 'hover:scale-[1.02] hover:-translate-y-1 cursor-pointer group',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-primary/20 before:via-transparent before:to-accent/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'relative z-10 px-6 py-4 @container/card-header grid auto-rows-min items-start gap-3 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-lg font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors duration-300', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm leading-relaxed opacity-90', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('relative z-10 px-6 pb-4 flex-1', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('relative z-10 flex items-center justify-between px-6 py-4 mt-auto border-t border-border/20 bg-gradient-to-r from-transparent via-muted/5 to-transparent', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
