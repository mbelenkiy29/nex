# Frontend View Patterns

This document contains view page field rendering, filter, actions, link, new button, and CSV export patterns. For backend patterns and overview, see [Entity CRUD Reference](entity-crud-reference.md).

## View Page Field Rendering by Field Type

The View page displays entity details in a consistent row-based layout with label/value pairs. Each field conditionally renders only when it has a value and includes a copy-to-clipboard button.

### Required Imports

```typescript
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { RelatedEntityLink } from '@/features/relatedEntity/components/RelatedEntityLink';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { relatedEntityLabel } from '@project/backend/features/relatedEntity/relatedEntityLabel';
```

### Base Layout Pattern

All fields use this consistent grid layout:

```typescript
{entity.fieldName != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.fieldName}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{/* value rendering */}</span>
      <CopyToClipboardButton text={/* copyable text */} />
    </div>
  </div>
)}
```

### 1. Text Field

Simple string display with copy button.

```typescript
{Boolean(entity.name) && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.name}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{entity.name}</span>
      <CopyToClipboardButton text={entity.name} />
    </div>
  </div>
)}
```

### 2. Integer Field

Number display with `.toString()` for copy button.

```typescript
{entity.year != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.year}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{entity.year}</span>
      <CopyToClipboardButton text={entity.year.toString()} />
    </div>
  </div>
)}
```

### 3. Decimal Field

Locale-aware formatting with configurable precision.

```typescript
{entity.amount != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.amount}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>
        {formatDecimal(entity.amount?.toString(), locale, 2)}
      </span>
      <CopyToClipboardButton
        text={formatDecimal(entity.amount?.toString(), locale, 2)}
      />
    </div>
  </div>
)}
```

### 4. Date Field

Localized date formatting using dictionary.

```typescript
{entity.startDate != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.startDate}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{formatDate(entity.startDate, dictionary)}</span>
      <CopyToClipboardButton
        text={formatDate(entity.startDate, dictionary)}
      />
    </div>
  </div>
)}
```

### 5. DateTime Field

Localized datetime formatting using dictionary.

```typescript
{entity.milestone != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.milestone}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{formatDateTime(entity.milestone, dictionary)}</span>
      <CopyToClipboardButton
        text={formatDateTime(entity.milestone, dictionary)}
      />
    </div>
  </div>
)}
```

### 6. Boolean Field

Displays localized "Yes" or "No" text.

```typescript
{entity.active != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.active}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>
        {entity.active
          ? dictionary.shared.yes
          : dictionary.shared.no}
      </span>
      <CopyToClipboardButton
        text={
          entity.active
            ? dictionary.shared.yes
            : dictionary.shared.no
        }
      />
    </div>
  </div>
)}
```

### 7. Enumerator Field (Single Select)

Translates enum value using dictionary enumerators.

```typescript
{entity.status != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.status}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>
        {dictionaryEnumerator(
          dictionary.entity.enumerators.status,
          entity.status,
        )}
      </span>
      <CopyToClipboardButton
        text={dictionaryEnumerator(
          dictionary.entity.enumerators.status,
          entity.status,
        )}
      />
    </div>
  </div>
)}
```

### 8. Enumerator Multiple Field (Multi-Select)

Maps array of enum values with individual copy buttons.

```typescript
{entity.tags?.length ? (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.tags}
    </div>
    <div className="col-span-2 flex flex-col gap-1">
      {entity.tags.map((value) => {
        return (
          <div key={value} className="flex items-center gap-4">
            <span>
              {dictionaryEnumerator(
                dictionary.entity.enumerators.tags,
                value,
              )}
            </span>
            <CopyToClipboardButton
              text={dictionaryEnumerator(
                dictionary.entity.enumerators.tags,
                value,
              )}
            />
          </div>
        );
      })}
    </div>
  </div>
) : null}
```

### 9. Tags Field (String Array)

Displays array of strings with individual copy buttons.

```typescript
{entity.keywords?.length ? (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.keywords}
    </div>
    <div className="col-span-2 flex flex-col gap-1">
      {entity.keywords.map((value) => {
        return (
          <div key={value} className="flex items-center gap-4">
            <span>{value}</span>
            <CopyToClipboardButton text={value} />
          </div>
        );
      })}
    </div>
  </div>
) : null}
```

### 10. Files Field

Displays file list with download links using FilesList component.

```typescript
{Boolean((entity.documents as Array<any>)?.length) && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.documents}
    </div>
    <div className="col-span-2">
      <FilesList files={entity.documents as Array<any>} />
    </div>
  </div>
)}
```

### 11. Images Field

Displays image gallery using ImagesGallery component.

```typescript
{Boolean((entity.photos as Array<any>)?.length) && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.photos}
    </div>
    <div className="col-span-2">
      <ImagesGallery value={entity.photos as any} />
    </div>
  </div>
)}
```

### 12. Relationship Field (Single - One-to-One / Many-to-One)

Uses EntityLink component with label function for copy button.

```typescript
{entity.category != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.category}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <CategoryLink category={entity.category} />
      <CopyToClipboardButton
        text={categoryLabel(entity.category, dictionary, locale)}
      />
    </div>
  </div>
)}
```

### 13. Relationship Field (Single - Member)

Special handling for member relationships using MemberLink.

```typescript
{entity.owner != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.owner}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <MemberLink member={entity.owner} />
      <CopyToClipboardButton text={memberLabel(entity.owner)} />
    </div>
  </div>
)}
```

### 14. Relationship Field (Multiple - One-to-Many / Many-to-Many)

Maps array of related entities with individual copy buttons.

```typescript
{entity.items?.length ? (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.items}
    </div>
    <div className="col-span-2 flex flex-col gap-1">
      {entity.items?.map((item) => {
        return (
          <div key={item?.id} className="flex items-center gap-4">
            <ItemLink
              item={item}
              className="whitespace-nowrap"
            />
            <CopyToClipboardButton
              text={itemLabel(item, dictionary, locale)}
            />
          </div>
        );
      })}
    </div>
  </div>
) : null}
```

### 15. Relationship Field (Multiple - Members)

Special handling for multiple member relationships.

```typescript
{entity.assignees?.length ? (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.assignees}
    </div>
    <div className="col-span-2 flex flex-col gap-1">
      {entity.assignees?.map((item) => {
        return (
          <div key={item?.id} className="flex items-center gap-4">
            <MemberLink member={item} className="whitespace-nowrap" />
            <CopyToClipboardButton text={memberLabel(item)} />
          </div>
        );
      })}
    </div>
  </div>
) : null}
```

### 16. Audit Fields (CreatedBy/UpdatedBy/ArchivedBy)

Standard audit trail display using MemberLink and formatDateTime.

```typescript
{/* Created by */}
{entity.createdByMember != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.createdByMember}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <MemberLink member={entity.createdByMember} />
      <CopyToClipboardButton
        text={memberLabel(entity.createdByMember)}
      />
    </div>
  </div>
)}

{/* Created at */}
{entity.createdAt != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.createdAt}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{formatDateTime(entity.createdAt, dictionary)}</span>
      <CopyToClipboardButton
        text={formatDateTime(entity.createdAt, dictionary)}
      />
    </div>
  </div>
)}

{/* Updated by */}
{entity.updatedByMember != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.updatedByMember}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <MemberLink member={entity.updatedByMember} />
      <CopyToClipboardButton
        text={memberLabel(entity.updatedByMember)}
      />
    </div>
  </div>
)}

{/* Updated at */}
{entity.updatedAt != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.updatedAt}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{formatDateTime(entity.updatedAt, dictionary)}</span>
      <CopyToClipboardButton
        text={formatDateTime(entity.updatedAt, dictionary)}
      />
    </div>
  </div>
)}

{/* Archived by (if archivable) */}
{entity.archivedByMember != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.archivedByMember}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <MemberLink member={entity.archivedByMember} />
      <CopyToClipboardButton
        text={memberLabel(entity.archivedByMember)}
      />
    </div>
  </div>
)}

{/* Archived at (if archivable) */}
{entity.archivedAt != null && (
  <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
    <div className="font-semibold">
      {dictionary.entity.fields.archivedAt}
    </div>
    <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
      <span>{formatDateTime(entity.archivedAt, dictionary)}</span>
      <CopyToClipboardButton
        text={formatDateTime(entity.archivedAt, dictionary)}
      />
    </div>
  </div>
)}
```

## View Page Field Summary Table

| Field Type              | Null Check              | Value Render                   | Copy Text                | Key Component   |
| ----------------------- | ----------------------- | ------------------------------ | ------------------------ | --------------- |
| Text                    | `Boolean(entity.field)` | `{entity.field}`               | `entity.field`           | -               |
| Integer                 | `!= null`               | `{entity.field}`               | `.toString()`            | -               |
| Decimal                 | `!= null`               | `formatDecimal()`              | `formatDecimal()`        | -               |
| Date                    | `!= null`               | `formatDate()`                 | `formatDate()`           | -               |
| DateTime                | `!= null`               | `formatDateTime()`             | `formatDateTime()`       | -               |
| Boolean                 | `!= null`               | `yes/no`                       | `yes/no`                 | -               |
| Enumerator              | `!= null`               | `dictionaryEnumerator()`       | `dictionaryEnumerator()` | -               |
| Enumerator Multiple     | `?.length`              | Map + `dictionaryEnumerator()` | Per-item                 | -               |
| Tags                    | `?.length`              | Map + `{value}`                | Per-item                 | -               |
| Files                   | `?.length`              | `<FilesList>`                  | N/A                      | `FilesList`     |
| Images                  | `?.length`              | `<ImagesGallery>`              | N/A                      | `ImagesGallery` |
| Relationship (single)   | `!= null`               | `<EntityLink>`                 | `entityLabel()`          | Entity Link     |
| Relationship (member)   | `!= null`               | `<MemberLink>`                 | `memberLabel()`          | `MemberLink`    |
| Relationship (multiple) | `?.length`              | Map + `<EntityLink>`           | Per-item label           | Entity Link     |
| Audit (member)          | `!= null`               | `<MemberLink>`                 | `memberLabel()`          | `MemberLink`    |
| Audit (timestamp)       | `!= null`               | `formatDateTime()`             | `formatDateTime()`       | -               |

## Key Differences from List Page

1. **Layout**: Uses 3-4 column grid instead of table columns
2. **Conditional Rendering**: Each field only renders if value exists
3. **Copy Button**: Every field has `<CopyToClipboardButton>`
4. **Images**: Uses `<ImagesGallery>` instead of `<Avatar>`
5. **Arrays**: Display as vertical list with individual copy buttons per item
6. **No Sorting**: View page doesn't need sorting controls

---

## Filter Component with All Field Types

```typescript
// features/entity/components/EntityListFilter.tsx
const emptyValues = {
  // Text inputs
  code: '',
  name: '',

  // Number range
  yearRange: [],
  amountRange: [],

  // Single select (enumerator)
  category: null,

  // Multi-select (enumerator array)
  tags: [],

  // Date range
  dateRange: [],

  // DateTime range
  timestampRange: [],
  createdAtRange: [],

  // Boolean select
  active: undefined,

  // Boolean switch
  archived: undefined,

  // Autocomplete single (relationship)
  relatedEntity: null,
  owner: null,

  // Autocomplete multiple (relationship array)
  items: [],
  associations: [],
};

export function EntityListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);

  // Preview renders for FilterPreview
  const previewRenders = {
    name: { label: dictionary.entity.fields.name },
    category: {
      label: dictionary.entity.fields.category,
      render: dataTableFilterRenders(locale, dictionary).enumerator(
        dictionary.entity.enumerators.category,
      ),
    },
    tags: {
      label: dictionary.entity.fields.tags,
      render: dataTableFilterRenders(locale, dictionary).enumeratorMultiple(
        dictionary.entity.enumerators.tags,
      ),
    },
    dateRange: {
      label: dictionary.entity.fields.date,
      render: dataTableFilterRenders(locale, dictionary).dateRange(),
    },
    amountRange: {
      label: dictionary.entity.fields.amount,
      render: dataTableFilterRenders(locale, dictionary).decimalRange(),
    },
    relatedEntity: {
      label: dictionary.entity.fields.relatedEntity,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        entityLabel,
      ),
    },
    items: {
      label: dictionary.entity.fields.items,
      render: dataTableFilterRenders(locale, dictionary).relationToMany(
        memberLabel,
      ),
    },
  };

  // Form implementation with all field types
  // See CLAUDE.md "Filter Form Pattern" for complete example
}
```

---

## Actions Component

```typescript
// features/entity/components/EntityActions.tsx
import { EntityWithRelationships } from '@project/backend/features/entity/entitySchemas';

export function EntityActions({
  mode,
  entity,
  referrer,
}: {
  mode: 'table' | 'view';
  entity: Entity;
  referrer?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Permission checks
  const hasPermissionToEdit = hasPermission({ entity: ['update'] });
  const hasPermissionToDelete = hasPermission({ entity: ['delete'] });
  const hasPermissionToArchive = hasPermission({ entity: ['archive'] });
  const hasPermissionToRestore = hasPermission({ entity: ['restore'] });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .delete(`api/entity?${objectToQuery({ ids: [entity.id] })}`)
        .json();
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['entity'] });
      if (mode === 'view') {
        navigate({
          to: referrer?.startsWith('/entity?') ? referrer : '/entity',
        });
      }
      toast.success(dictionary.entity.delete.success);
    },
  });

  // Archive/restore mutations similar pattern
  // Dropdown menu with conditional actions based on permissions
  // See CLAUDE.md "Action Component Pattern" for complete example
}
```

---

## Link Component

```typescript
// features/entity/components/EntityLink.tsx
import { entityLabel } from '@project/backend/features/entity/entityLabel';
import { EntityWithRelationships } from '@project/backend/features/entity/entitySchemas';

export function EntityLink({
  entity,
  className,
}: {
  entity?: Partial<EntityWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!entity) {
    return '';
  }

  const hasPermissionToRead = hasPermission({ entity: ['read'] });

  if (!hasPermissionToRead) {
    return <span className={className}>{entityLabel(entity, dictionary)}</span>;
  }

  return (
    <Link
      to={`/entity/$id`}
      params={{ id: entity.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn('text-blue-500 hover:underline', className)}
      preload="intent"
    >
      {entityLabel(entity, dictionary)}
    </Link>
  );
}
```

---

## New Button Component

```typescript
// features/entity/components/EntityNewButton.tsx
export function EntityNewButton() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToCreate = hasPermission({ entity: ['create'] });

  if (!hasPermissionToCreate) {
    return null;
  }

  return (
    <Button
      nativeButton={false}
      render={
        <Link
          to="/entity/new"
          search={{
            referrer: window.location.pathname + window.location.search,
          }}
        />
      }
    >
      {dictionary.entity.new.menu}
    </Button>
  );
}
```

---

## CSV Export Mapper

```typescript
// features/entity/entityExporterMapper.ts (FRONTEND)
import { EntityWithRelationships } from '@project/backend/features/entity/entitySchemas';
import { entityLabel } from '@project/backend/features/entity/entityLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function entityExporterMapper(
  entities: EntityWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return entities.map((entity) => ({
    id: entity.id,
    name: entity.name,
    contact: entity.contact,
    status: dictionaryEnumerator(
      context.dictionary.entity.enumerators.status,
      entity.status,
    ),
    amount: formatDecimal(entity.amount?.toString(), context.locale, 2),
    owner: memberLabel(entity.owner),
    createdAt: String(entity.createdAt),
    updatedAt: String(entity.updatedAt),
  }));
}

// Usage in list actions
import { csvExporter } from '@/shared/lib/csvExporter';
import { entityExporterMapper } from '@/features/entity/entityExporterMapper';

const exportMutation = useMutation({
  mutationFn: async () => {
    return await apiClient
      .get(`api/entity?${objectToQuery({ filter, orderBy: sorting })}`)
      .json<{ entities: EntityWithRelationships[] }>();
  },
  onSuccess: (data) => {
    csvExporter(
      entityExporterMapper(data.entities, { dictionary, locale }),
      dictionary.entity.fields,
      'entities',
    );
    toast.success(dictionary.entity.export.success);
  },
});
```

## Base UI Component Patterns

UI components use Base UI (shadcn v5) instead of Radix primitives. The key API difference:

- **No `asChild`** — Base UI uses a `render` prop to compose elements
- **`nativeButton={false}`** — Required when Button renders as a non-button element (e.g., Link)

### Button as Link

```typescript
// Base UI pattern (render prop)
<Button
  nativeButton={false}
  render={<Link to="/entity/new" />}
>
  {dictionary.entity.new.menu}
</Button>

// ❌ Old Radix pattern (asChild) — do NOT use
// <Button asChild><Link to="/entity/new">...</Link></Button>
```

### Dialog Close as Button

```typescript
<DialogPrimitive.Close
  render={<Button variant="ghost" size="icon-sm" />}
>
  <XIcon />
</DialogPrimitive.Close>
```

### DropdownMenu Link Item

```typescript
<DropdownMenuLinkItem
  render={<Link to="/entity/importer" />}
>
  <MdUpload className="text-foreground/50 mr-2 h-4 w-4" />
  <span>{dictionary.shared.importer.title}</span>
</DropdownMenuLinkItem>
```

### Sidebar Menu Button as Link

```typescript
<SidebarMenuButton
  render={<Link to="/entity" />}
  tooltip={dictionary.entity.list.menu}
>
  <LuIcon />
  <span>{dictionary.entity.list.menu}</span>
</SidebarMenuButton>
```

### Breadcrumb Link

```typescript
<BreadcrumbLink render={<Link to={path} />}>
  {label}
</BreadcrumbLink>
```

## Related Documentation

- [Entity CRUD Reference](entity-crud-reference.md) - Backend patterns, overview, testing
- [Frontend Form Patterns](frontend-form-patterns.md) - Form component with all field types
- [Frontend List Patterns](frontend-list-patterns.md) - Data table and list column patterns
