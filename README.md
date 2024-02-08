## Features

- Authentication using Supabase Auth
- File Uploads using Supabase Storage

# Set up Storage

- Create a new storage bucket and set the `STORAGE_BUCKET` environment variable to the bucket name.
- Create the following storage policies for the bucket:

## Access own files

- Name: `Access own files`
- Allowed operation: `SELECT`
- Target roles: (default)
- Policy definition:

```sql
bucket_id = 'Files' and owner_id = auth.uid()::text and (storage.foldername(name))[1] = auth.uid()::text
```

## Allow upload

- Name: `Allow upload`
- Allowed operation: `INSERT`
- Target roles: (default)
- Policy definition:

```sql
bucket_id = 'Files' and (storage.foldername(name))[1] = auth.uid()::text
```

## Delete own files

- Name: `Delete own files`
- Allowed operation: `SELECT`, `DELETE`
- Target roles: (default)
- Policy definition:

```sql
bucket_id = 'Files' and owner_id = auth.uid()::text and (storage.foldername(name))[1] = auth.uid()::text
```
