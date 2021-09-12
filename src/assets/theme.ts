import { ThemeStyle } from '@type/infinityBoard'

export const defaultLight: ThemeStyle = {
  mainColor: '#0D6EFD',
  secondColor: '#CED4DA',
  backgroundColor: '#FFFFFF',
  textColor: '#0D6EFD',
  board: {
    shadow: '0px 0px 10px 0px rgba(34, 60, 80, 0.2)',
  },
  block: {
    shadow: '0px 0px 10px 0px rgba(34, 60, 80, 0.2)',
    borderRadius: '0.5rem',
    header: {
      justifyContent: 'center',
    },
    content: {},
  },
}

export const defaultDark: ThemeStyle = {
  mainColor: '#0D6EFD',
  secondColor: '#202120',
  backgroundColor: '#272822',
  textColor: '#1FE5C1',
  board: {
    borderColor: '#1FE5C1',
  },
  block: {
    borderRadius: '0.5rem',
    backgroundColor: '#34352F',
    borderColor: '#1FE5C1',
    header: {
      justifyContent: 'center',
    },
    content: {},
  },
}
