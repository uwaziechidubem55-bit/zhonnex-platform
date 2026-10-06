-- ============================================
-- ZHONNEX CORP — PRIVATE SECURE MODE
-- Run this AFTER supabase.sql in Supabase SQL Editor
-- This LOCKS Supabase: public = 0 rows, only YOU via API (service_role)
-- Scammers/hackers with anon key see NOTHING
-- ============================================

-- 1. MAKE ALL BUCKETS PRIVATE (no public URL)
update storage.buckets set public = false where id in ('videos','images','voice-notes','feed-assets','submissions','teacher-private');

-- 2. DROP OLD PERMISSIVE POLICIES (demo "Allow all for anon")
drop policy if exists "Allow all for anon" on public.passkeys;
drop policy if exists "Allow all for anon" on public.payments;
drop policy if exists "Allow all for anon" on public.feed_items;
drop policy if exists "Allow all for anon" on public.teacher_assets;
drop policy if exists "Allow all for anon" on public.leads;
drop policy if exists "Allow all for anon" on public.tasks;
drop policy if exists "Allow all for anon" on public.submissions;
drop policy if exists "Allow all for anon" on public.audit_log;
drop policy if exists "Allow all for anon" on public.pricing_config;

drop policy if exists "Public read videos" on storage.objects;
drop policy if exists "Allow upload videos" on storage.objects;
drop policy if exists "Public read images" on storage.objects;
drop policy if exists "Allow upload images" on storage.objects;
drop policy if exists "Public read voice" on storage.objects;
drop policy if exists "Allow upload voice" on storage.objects;
drop policy if exists "Public read feed" on storage.objects;
drop policy if exists "Allow upload feed" on storage.objects;
drop policy if exists "Public read submissions" on storage.objects;
drop policy if exists "Allow upload submissions" on storage.objects;

-- 3. CREATE PRIVATE POLICIES — ONLY service_role (your API) CAN READ/WRITE
create policy "Service role only - passkeys" on public.passkeys for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - payments" on public.payments for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - feed_items" on public.feed_items for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - teacher_assets" on public.teacher_assets for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - leads" on public.leads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - tasks" on public.tasks for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - submissions" on public.submissions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - audit_log" on public.audit_log for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role only - pricing_config" on public.pricing_config for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Storage: ONLY service_role via API can upload/download
create policy "Service role only - storage" on storage.objects for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');