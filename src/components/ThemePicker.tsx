import { DropdownMenu, Button, IconButton, Text, Flex } from '@radix-ui/themes'
import { Palette, Check, Sun, Moon } from 'lucide-react'
import { useTheme, FONT_THEMES } from '../contexts/ThemeContext'

export function ThemePicker() {
  const { currentTheme, setTheme, darkMode, toggleDarkMode } = useTheme()

  return (
    <Flex gap="1" align="center">
      <IconButton variant="ghost" size="1" onClick={toggleDarkMode} aria-label="Toggle dark mode">
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </IconButton>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" size="1">
            <Palette size={16} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Font Theme</DropdownMenu.Label>
          {FONT_THEMES.map((theme) => (
            <DropdownMenu.Item
              key={theme.id}
              onClick={() => setTheme(theme.id)}
            >
              <Flex justify="between" align="center" gap="5" minWidth="200px">
                <Flex direction="column" gap="1">
                  <Text size="2" weight="medium">{theme.name}</Text>
                  <Text size="1" color="gray">{theme.description}</Text>
                </Flex>
                {currentTheme.id === theme.id && <Check size={16} />}
              </Flex>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  )
}
