'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type avaliableLang = 'id' | 'en'

interface LanguageContextType {
  lang: avaliableLang
  changeLang: (lang: avaliableLang) => void
  isId: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<avaliableLang>('id')
  const [isId, setIsId] = useState<boolean>(localStorage.getItem('lang') === 'id')

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as avaliableLang | null
    if (storedLang) setLang(storedLang)
  }, [])

  const changeLang = (newLang: avaliableLang) => {
    setLang(newLang)
    if(newLang === 'id') setIsId(true)
    if(newLang !== 'id') setIsId(false)
    localStorage.setItem('lang', newLang)
  }

  return <LanguageContext.Provider value={{ lang, changeLang, isId }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be inside language provider.')
  
  return context
}
