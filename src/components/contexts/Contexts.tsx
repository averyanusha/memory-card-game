import { createContext } from 'react';
import type { Card } from '../CardDatabase';

type CardSet = {
  cardDeck: Card[],
  setCardDeck: (value: Card[]) => void
}
type Auth = {
  isLoggedIn: boolean,
  setIsLoggedIn: (value: boolean) => void
}

type User = {
  username: string,
  setUserName: (value: string) => void
}

type Modal = {
  showModal: boolean,
  setShowModal: (value: boolean) => void
}

type VerifyBanner = {
  bannerOpen: boolean,
  setBannerOpen: (value: boolean) => void
}
type VerifyEmail = {
  emailVerified: boolean,
  setEmailVerified: (value: boolean) => void
}

export const VerifyEmailContext = createContext<VerifyEmail | null>(null);
export const AuthContext = createContext<Auth | null >(null);
export const UserContext = createContext<User | null >(null);
export const ModalContext = createContext<Modal | null >(null);
export const BannerContext = createContext<VerifyBanner | null>(null);
export const CardSetContext = createContext<CardSet | null>(null);