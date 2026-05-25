'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { locales } from '@project/backend/translation/locales';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { LuCheck } from 'react-icons/lu';
import { LuLanguages } from 'react-icons/lu';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export function LanguageSwitcher({ isSidebar }: { isSidebar?: boolean }) {
  const [open, setOpen] = useState(false);
  const { setLocale, locale, dictionary } = useAuthStore(
    useShallow((state) => ({
      setLocale: state.setLocale,
      locale: state.locale,
      dictionary: state.dictionary,
    })),
  );

  if (isSidebar) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <SidebarMenuButton
                  tooltip={dictionary?.shared?.locales?.[locale] || locale}
                />
              }
            >
              <LuLanguages className="h-4 w-4" />
              <span className="truncate">
                {dictionary?.shared?.localeSwitcher?.title || 'Language'}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandInput
                    placeholder={
                      dictionary?.shared?.localeSwitcher?.searchPlaceholder ||
                      'Search language...'
                    }
                  />
                  <CommandEmpty>
                    {dictionary?.shared?.localeSwitcher?.searchEmpty}
                  </CommandEmpty>
                  <CommandGroup
                    heading={
                      dictionary?.shared?.localeSwitcher?.title || 'Languages'
                    }
                    className="max-h-[340px] overflow-y-auto"
                  >
                    {locales.map((localeOption) => (
                      <CommandItem
                        key={localeOption}
                        onSelect={() => {
                          setLocale(localeOption);
                        }}
                        className="text-sm"
                      >
                        {dictionaryEnumerator(
                          dictionary!.shared.locales,
                          localeOption,
                        ) || localeOption}
                        <LuCheck
                          className={cn(
                            'ml-auto h-4 w-4',
                            localeOption === locale
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="ghost" size="sm" className="w-9 p-0 px-1" />}
      >
        <LuLanguages className="text-muted-foreground h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput
              placeholder={
                dictionary?.shared?.localeSwitcher?.searchPlaceholder ||
                'Search language...'
              }
            />
            <CommandEmpty>
              {dictionary?.shared?.localeSwitcher?.searchEmpty}
            </CommandEmpty>
            <CommandGroup
              heading={dictionary?.shared?.localeSwitcher?.title || 'Languages'}
              className="max-h-[340px] overflow-y-auto"
            >
              {locales.map((localeOption) => (
                <CommandItem
                  key={localeOption}
                  onSelect={() => {
                    setLocale(localeOption);
                  }}
                  className="text-sm"
                >
                  {dictionaryEnumerator(
                    dictionary!.shared.locales,
                    localeOption,
                  ) || localeOption}
                  <LuCheck
                    className={cn(
                      'ml-auto h-4 w-4',
                      localeOption === locale ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
