import { useState } from 'react';
import { LuPlus, LuTrash } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  useCreateSessionType,
  useDeleteSessionType,
  useMyAvailability,
} from './hooks/useOneOnOneCall';
import {
  formatOneOnOnePrice,
  isOneOnOneCurrencyValid,
  normalizeOneOnOneCurrency,
  ONE_ON_ONE_MAX_PRICE_CENTS,
  ONE_ON_ONE_MIN_PRICE_CENTS,
  parseOneOnOnePriceAmount,
} from './oneOnOneCallFormat';

export function SessionTypeEditor() {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.sessionType);
  const locale = useAuthStore((s) => s.locale);
  const query = useMyAvailability();
  const create = useCreateSessionType();
  const remove = useDeleteSessionType();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isFree, setIsFree] = useState(true);
  const [priceAmount, setPriceAmount] = useState('25.00');
  const [currency, setCurrency] = useState('USD');
  const [bufferMinutes, setBufferMinutes] = useState(0);
  const [minNoticeHours, setMinNoticeHours] = useState(12);

  const normalizedCurrency = normalizeOneOnOneCurrency(currency);
  const priceCents = parseOneOnOnePriceAmount(priceAmount);
  const isPaidPriceInvalid =
    !isFree &&
    (priceCents === null ||
      priceCents < ONE_ON_ONE_MIN_PRICE_CENTS ||
      priceCents > ONE_ON_ONE_MAX_PRICE_CENTS);
  const isCurrencyInvalid =
    !isFree && !isOneOnOneCurrencyValid(normalizedCurrency);
  const canSave =
    Boolean(title.trim()) &&
    !isPaidPriceInvalid &&
    !isCurrencyInvalid &&
    !create.isPending;

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDurationMinutes(30);
    setIsFree(true);
    setPriceAmount('25.00');
    setCurrency('USD');
    setBufferMinutes(0);
    setMinNoticeHours(12);
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!canSave || (!isFree && priceCents === null)) return;

    await create.mutateAsync({
      title: title.trim(),
      description: description.trim() || null,
      durationMinutes,
      isFree,
      priceCents: isFree ? null : priceCents,
      currency: normalizedCurrency,
      bufferMinutes,
      minNoticeHours,
    });
    resetForm();
  };

  const sessionTypes = query.data?.sessionTypes ?? [];

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold">{t.title}</h2>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </div>
          <Button
            variant={showForm ? 'ghost' : 'default'}
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            <LuPlus className="mr-1 size-4" /> {t.add}
          </Button>
        </header>

        {showForm ? (
          <div className="space-y-3 rounded-xl border p-4">
            <div className="space-y-2">
              <Label>{t.fields.title}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t.fields.description}</Label>
              <Textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>{t.fields.durationMinutes}</Label>
                <Input
                  type="number"
                  min={10}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.fields.bufferMinutes}</Label>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={bufferMinutes}
                  onChange={(e) => setBufferMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.fields.minNoticeHours}</Label>
                <Input
                  type="number"
                  min={0}
                  max={720}
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.pricingModeLabel}</Label>
              <div
                className="grid grid-cols-2 gap-2"
                role="group"
                aria-label={t.pricingModeLabel}
              >
                <Button
                  type="button"
                  variant={isFree ? 'default' : 'outline'}
                  onClick={() => setIsFree(true)}
                >
                  {t.freeMode}
                </Button>
                <Button
                  type="button"
                  variant={isFree ? 'outline' : 'default'}
                  onClick={() => setIsFree(false)}
                >
                  {t.paidMode}
                </Button>
              </div>
            </div>
            {!isFree ? (
              <>
                <div className="grid grid-cols-[1fr_7rem] gap-3">
                  <div className="space-y-2">
                    <Label>{t.fields.priceAmount}</Label>
                    <Input
                      inputMode="decimal"
                      placeholder={t.priceAmountPlaceholder}
                      value={priceAmount}
                      aria-invalid={isPaidPriceInvalid}
                      onChange={(e) => setPriceAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.fields.currency}</Label>
                    <Input
                      value={currency}
                      maxLength={3}
                      aria-invalid={isCurrencyInvalid}
                      onChange={(e) =>
                        setCurrency(
                          e.target.value
                            .replace(/[^a-z]/gi, '')
                            .toUpperCase()
                            .slice(0, 3),
                        )
                      }
                    />
                  </div>
                </div>
                {isPaidPriceInvalid ? (
                  <p className="text-destructive text-xs" role="alert">
                    {t.priceInvalid}
                  </p>
                ) : null}
                {isCurrencyInvalid ? (
                  <p className="text-destructive text-xs" role="alert">
                    {t.currencyInvalid}
                  </p>
                ) : null}
                <p className="text-muted-foreground text-xs">{t.paidHelper}</p>
              </>
            ) : null}
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!canSave}>
                {t.save}
              </Button>
              <Button variant="ghost" onClick={resetForm}>
                {t.cancel}
              </Button>
            </div>
          </div>
        ) : null}

        {query.isLoading ? (
          <Spinner className="size-4" />
        ) : sessionTypes.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t.empty}</p>
        ) : (
          <ul className="space-y-2">
            {sessionTypes.map((st) => (
              <li
                key={st.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm"
              >
                <div>
                  <div className="font-semibold">{st.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {t.durationMinutesShort.replace(
                      '{0}',
                      String(st.durationMinutes),
                    )}{' '}
                    ·{' '}
                    {st.isFree
                      ? t.freeLabel
                      : formatOneOnOnePrice(st.priceCents, st.currency, locale)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t.disable}
                  onClick={() => remove.mutate(st.id)}
                >
                  <LuTrash className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
