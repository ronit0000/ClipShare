import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('https://ybueanmewrciysqlkdnb.supabase.co')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

serve(async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data: uploads, error } = await supabase
    .from('uploads')
    .select('id, files')
    .lt('created_at', fiveMinutesAgo);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  for (const upload of uploads) {
    for (const file of upload.files) {
      const { error: storageError } = await supabase
        .from('clipshare-files')
        .remove([file.path]);
      if (storageError) console.error(storageError);
    }

    const { error: dbError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', upload.id);

    if (dbError) console.error(dbError);
  }

  return new Response(JSON.stringify({ status: 'cleanup done' }), { headers: { 'Content-Type': 'application/json' } });
});
