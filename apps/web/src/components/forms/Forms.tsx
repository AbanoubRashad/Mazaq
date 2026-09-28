'use client';

import { api } from '@mazaq/api';
import { useTranslations } from 'next-intl';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CheckIcon } from '../icons';
import { Field, isEmail, isPhone } from './Field';

type Errors = Record<string, string | undefined>;

function useSubmit() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  return { status, setStatus, reference, setReference };
}

function FormShell({
  onSubmit,
  status,
  reference,
  submitLabel,
  errorsSummary,
  children,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  status: string;
  reference: string;
  submitLabel: string;
  errorsSummary: string | null;
  children: ReactNode;
}) {
  const t = useTranslations();
  if (status === 'done') {
    return (
      <div role="status" className="flex items-start gap-3 rounded-[18px] bg-sage-100 p-6 text-[16px]">
        <CheckIcon className="mt-0.5 shrink-0 text-teal-800" />
        <p>{t('forms.success', { reference })}</p>
      </div>
    );
  }
  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5 rounded-[20px] bg-white p-6 lg:p-8">
      {errorsSummary && (
        <p role="alert" className="rounded-[12px] bg-[#FCEDEC] p-3 text-[14px] text-[#B3261E]">
          {errorsSummary}
        </p>
      )}
      {children}
      {status === 'error' && (
        <p role="alert" className="text-[14px] text-[#B3261E]">
          {t('common.error')}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="h-14 self-start rounded-full bg-teal-800 px-8 text-[16px] font-bold text-white hover:bg-teal-600 disabled:opacity-70"
      >
        {status === 'sending' ? t('common.sending') : submitLabel}
      </button>
    </form>
  );
}

function focusFirstError(form: HTMLFormElement) {
  form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
}

export function CorporateForm() {
  const t = useTranslations();
  const s = useSubmit();
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement | null>(null);
  const [tomorrow] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current = e.currentTarget;
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    const next: Errors = {};
    if (!v('company')) next.company = t('forms.errors.required');
    if (!v('contact')) next.contact = t('forms.errors.required');
    if (!isEmail(v('email'))) next.email = t('forms.errors.email');
    if (v('phone') && !isPhone(v('phone'))) next.phone = t('forms.errors.phone');
    const hc = Number(v('headcount'));
    if (!Number.isInteger(hc) || hc < 5 || hc > 5000) next.headcount = t('forms.errors.headcount');
    if (!v('date') || v('date') < tomorrow) next.date = t('forms.errors.date');
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => formRef.current && focusFirstError(formRef.current));
      return;
    }
    s.setStatus('sending');
    try {
      const r = await api.submitCorporateEnquiry({
        company: v('company'),
        contact: v('contact'),
        email: v('email'),
        phone: v('phone') || undefined,
        headcount: hc,
        date: v('date'),
        message: v('message') || undefined,
      });
      s.setReference(r.reference);
      s.setStatus('done');
    } catch {
      s.setStatus('error');
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  return (
    <FormShell
      onSubmit={onSubmit}
      status={s.status}
      reference={s.reference}
      submitLabel={t('pages.corporate.submit')}
      errorsSummary={hasErrors ? t('forms.fixErrors') : null}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label={t('forms.company')} error={errors.company}>
          {(p) => <input {...p} name="company" autoComplete="organization" className={`${p.className} h-12`} />}
        </Field>
        <Field id="contact" label={t('forms.contactName')} error={errors.contact}>
          {(p) => <input {...p} name="contact" autoComplete="name" className={`${p.className} h-12`} />}
        </Field>
        <Field id="email" label={t('forms.email')} error={errors.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" className={`${p.className} h-12`} />}
        </Field>
        <Field id="phone" label={t('forms.phone')} error={errors.phone} optionalLabel={t('common.optional')}>
          {(p) => <input {...p} name="phone" type="tel" autoComplete="tel" className={`${p.className} h-12`} />}
        </Field>
        <Field id="headcount" label={t('forms.headcount')} error={errors.headcount}>
          {(p) => <input {...p} name="headcount" type="number" inputMode="numeric" min={5} max={5000} className={`${p.className} h-12`} />}
        </Field>
        <Field id="date" label={t('forms.date')} error={errors.date}>
          {(p) => <input {...p} name="date" type="date" min={tomorrow} className={`${p.className} h-12`} />}
        </Field>
      </div>
      <Field id="message" label={t('forms.message')} optionalLabel={t('common.optional')}>
        {(p) => <textarea {...p} name="message" rows={4} className={`${p.className} py-3`} />}
      </Field>
    </FormShell>
  );
}

export function FranchiseForm() {
  const t = useTranslations();
  const s = useSubmit();
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    const next: Errors = {};
    if (!v('name')) next.name = t('forms.errors.required');
    if (!isEmail(v('email'))) next.email = t('forms.errors.email');
    if (!v('country')) next.country = t('forms.errors.required');
    if (!v('city')) next.city = t('forms.errors.required');
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => focusFirstError(form));
      return;
    }
    s.setStatus('sending');
    try {
      const r = await api.submitFranchiseEnquiry({
        name: v('name'),
        email: v('email'),
        country: v('country'),
        city: v('city'),
        experience: v('experience') || undefined,
      });
      s.setReference(r.reference);
      s.setStatus('done');
    } catch {
      s.setStatus('error');
    }
  };

  return (
    <FormShell
      onSubmit={onSubmit}
      status={s.status}
      reference={s.reference}
      submitLabel={t('pages.franchise.submit')}
      errorsSummary={Object.values(errors).some(Boolean) ? t('forms.fixErrors') : null}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fr-name" label={t('forms.name')} error={errors.name}>
          {(p) => <input {...p} name="name" autoComplete="name" className={`${p.className} h-12`} />}
        </Field>
        <Field id="fr-email" label={t('forms.email')} error={errors.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" className={`${p.className} h-12`} />}
        </Field>
        <Field id="fr-country" label={t('forms.country')} error={errors.country}>
          {(p) => <input {...p} name="country" autoComplete="country-name" className={`${p.className} h-12`} />}
        </Field>
        <Field id="fr-city" label={t('forms.city')} error={errors.city}>
          {(p) => <input {...p} name="city" autoComplete="address-level2" className={`${p.className} h-12`} />}
        </Field>
      </div>
      <Field id="fr-exp" label={t('forms.experience')} optionalLabel={t('common.optional')}>
        {(p) => <textarea {...p} name="experience" rows={4} className={`${p.className} py-3`} />}
      </Field>
    </FormShell>
  );
}

export function ContactForm() {
  const t = useTranslations();
  const s = useSubmit();
  const [errors, setErrors] = useState<Errors>({});
  const topics = ['order', 'feedback', 'careers', 'press', 'other'] as const;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    const next: Errors = {};
    if (!v('name')) next.name = t('forms.errors.required');
    if (!isEmail(v('email'))) next.email = t('forms.errors.email');
    if (v('message').length < 5) next.message = t('forms.errors.required');
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => focusFirstError(form));
      return;
    }
    s.setStatus('sending');
    try {
      const r = await api.submitContact({
        name: v('name'),
        email: v('email'),
        topic: (v('topic') || 'other') as (typeof topics)[number],
        message: v('message'),
      });
      s.setReference(r.reference);
      s.setStatus('done');
    } catch {
      s.setStatus('error');
    }
  };

  return (
    <FormShell
      onSubmit={onSubmit}
      status={s.status}
      reference={s.reference}
      submitLabel={t('pages.contact.submit')}
      errorsSummary={Object.values(errors).some(Boolean) ? t('forms.fixErrors') : null}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="ct-name" label={t('forms.name')} error={errors.name}>
          {(p) => <input {...p} name="name" autoComplete="name" className={`${p.className} h-12`} />}
        </Field>
        <Field id="ct-email" label={t('forms.email')} error={errors.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" className={`${p.className} h-12`} />}
        </Field>
      </div>
      <Field id="ct-topic" label={t('forms.topic')}>
        {(p) => (
          <select {...p} name="topic" className={`${p.className} h-12`}>
            {topics.map((k) => (
              <option key={k} value={k}>
                {t(`forms.topics.${k}`)}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="ct-message" label={t('forms.message')} error={errors.message}>
        {(p) => <textarea {...p} name="message" rows={5} className={`${p.className} py-3`} />}
      </Field>
    </FormShell>
  );
}

export function RewardsSignup() {
  const t = useTranslations();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPhone(phone)) {
      setError(t('rewards.invalidPhone'));
      document.getElementById('rw-phone')?.focus();
      return;
    }
    setError(undefined);
    setStatus('sending');
    await api.requestOtp(phone);
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <p role="status" className="flex items-start gap-3 rounded-[18px] bg-sage-100 p-5 text-[16px] text-ink">
        <CheckIcon className="mt-0.5 shrink-0 text-teal-800" />
        {t('rewards.codeSent')}
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4 rounded-[20px] bg-white p-6 text-ink">
      <Field id="rw-name" label={t('rewards.name')} optionalLabel={t('common.optional')}>
        {(p) => <input {...p} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className={`${p.className} h-12`} />}
      </Field>
      <Field id="rw-phone" label={t('rewards.phone')} hint={t('rewards.phoneHint')} error={error}>
        {(p) => (
          <input
            {...p}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+20 10 0000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${p.className} h-12 text-start`}
          />
        )}
      </Field>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="h-14 rounded-full bg-teal-800 px-8 text-[16px] font-bold text-white hover:bg-teal-600 disabled:opacity-70"
      >
        {status === 'sending' ? t('common.sending') : t('rewards.sendCode')}
      </button>
    </form>
  );
}
