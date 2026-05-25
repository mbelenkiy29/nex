# Frontend List Patterns

This document contains data table and list column patterns for all field types. For backend patterns and overview, see [Entity CRUD Reference](entity-crud-reference.md).

## Data Table Component

```typescript
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnHeader } from '@/shared/components/dataTable/DataTableColumnHeader';
import { ColumnDef } from '@tanstack/react-table';
import { EntityWithRelationships } from '@project/backend/features/entity/entitySchemas';

const columns: ColumnDef<EntityWithRelationships>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'contact',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
  },
  {
    id: 'actions',
    meta: { sticky: true }, // Sticky actions column
    cell: ({ row }) => <EntityActions entity={row.original} />,
  },
];

<DataTable
  columns={columns}
  data={rows}
  count={count}
  filter={filter}
  sorting={sorting}
  setSorting={setSorting}
  isLoading={query.isLoading}
  tableId="entities"
/>
```

## List Column Definitions by Field Type

Each field type has a specific pattern for rendering in data table columns. Below are all field type patterns with imports and column definitions.

### Required Imports

```typescript
import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { downloadUrl } from '@/shared/lib/downloadUrl';
import { FilesList } from '@/features/file/components/FilesList';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { RelatedEntityLink } from '@/features/relatedEntity/components/RelatedEntityLink';
```

### 1. Text Field

Simple string display with default cell rendering.

```typescript
{
  accessorKey: 'name',
  meta: {
    title: dictionary.entity.fields.name,
  },
},
```

### 2. Text Field (Display/Link Column)

First column typically links to entity detail page using the entity label function.

```typescript
import { entityLabel } from '@project/backend/features/entity/entityLabel';

{
  accessorKey: 'name',
  meta: {
    title: dictionary.entity.fields.name,
  },
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      <Link
        className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
        to={`/entity/${row?.original?.id}`}
        search={{
          referrer: window.location.pathname + window.location.search,
        }}
      >
        {entityLabel(row?.original, dictionary, locale)}
      </Link>
    </span>
  ),
},
```

### 3. Integer Field

Right-aligned number display.

```typescript
{
  accessorKey: 'year',
  meta: {
    title: dictionary.entity.fields.year,
  },
  header: dataTableHeader('right'),
  cell: ({ getValue }) => {
    return (
      <div className="text-right whitespace-nowrap">
        {getValue() as string}
      </div>
    );
  },
},
```

### 4. Decimal Field

Right-aligned with locale-aware formatting and configurable decimal places.

```typescript
{
  accessorKey: 'amount',
  meta: {
    title: dictionary.entity.fields.amount,
  },
  header: dataTableHeader('right'),
  cell: ({ getValue }) => {
    return (
      <div className="text-right whitespace-nowrap">
        {formatDecimal(getValue() as string, locale, 2)} {/* 2 = decimal places */}
      </div>
    );
  },
},
```

### 5. Date Field

Formatted date using dictionary for localization.

```typescript
{
  accessorKey: 'startDate',
  meta: {
    title: dictionary.entity.fields.startDate,
  },
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {formatDate(row.getValue('startDate'), dictionary)}
    </span>
  ),
},
```

### 6. DateTime Field

Formatted datetime using dictionary for localization.

```typescript
{
  accessorKey: 'milestone',
  meta: {
    title: dictionary.entity.fields.milestone,
  },
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {formatDateTime(row.getValue('milestone'), dictionary)}
    </span>
  ),
},
```

### 7. Boolean Field

Displays localized "Yes" or "No" text.

```typescript
{
  accessorKey: 'active',
  meta: {
    title: dictionary.entity.fields.active,
  },
  cell: ({ row }) => {
    return row.getValue('active')
      ? dictionary.shared.yes
      : dictionary.shared.no;
  },
},
```

### 8. Enumerator Field (Single Select)

Translates enum value using dictionary enumerators.

```typescript
{
  accessorKey: 'status',
  meta: {
    title: dictionary.entity.fields.status,
  },
  cell: ({ row }) => {
    return dictionaryEnumerator(
      dictionary.entity.enumerators.status,
      row.getValue('status'),
    );
  },
},
```

### 9. Enumerator Multiple Field (Multi-Select)

Maps array of enum values to translated labels. Sorting disabled for arrays.

```typescript
{
  accessorKey: 'tags',
  meta: {
    title: dictionary.entity.fields.tags,
  },
  enableSorting: false,
  cell: ({ row }) => {
    return (
      <div>
        {(row.getValue('tags') as Array<string>).map((value) => {
          return (
            <div key={value}>
              {dictionaryEnumerator(
                dictionary.entity.enumerators.tags,
                value,
              )}
            </div>
          );
        })}
      </div>
    );
  },
},
```

### 10. Tags Field (String Array)

Displays array of strings as stacked items.

```typescript
{
  accessorKey: 'keywords',
  meta: {
    title: dictionary.entity.fields.keywords,
  },
  enableSorting: false,
  cell: ({ row }) => {
    return (
      <div>
        {(row.getValue('keywords') as Array<string>).map((value) => {
          return <div key={value}>{value}</div>;
        })}
      </div>
    );
  },
},
```

### 11. Files Field

Displays file list with download links using FilesList component.

```typescript
{
  accessorKey: 'documents',
  meta: {
    title: dictionary.entity.fields.documents,
  },
  enableSorting: false,
  cell: ({ row }) => {
    return (
      <span className="whitespace-nowrap">
        <FilesList files={row.getValue('documents')} />
      </span>
    );
  },
},
```

### 12. Images Field

Displays first image as avatar thumbnail using downloadUrl helper.

```typescript
{
  accessorKey: 'photos',
  meta: {
    title: dictionary.entity.fields.photos,
  },
  enableSorting: false,
  cell: ({ row }) => {
    const photos: FileUploaded[] = row.getValue('photos');
    return (
      <Avatar>
        <AvatarImage src={downloadUrl(photos)} className="object-cover" />
        <AvatarFallback></AvatarFallback>
      </Avatar>
    );
  },
},
```

### 13. Relationship Field (Single - One-to-One / Many-to-One)

Uses EntityLink component for permission-aware linking.

```typescript
{
  accessorKey: 'category',
  meta: {
    title: dictionary.entity.fields.category,
  },
  enableSorting: false,
  cell: ({ row }) => {
    return <CategoryLink category={row.getValue('category')} />;
  },
},
```

### 14. Relationship Field (Multiple - One-to-Many / Many-to-Many)

Maps array of related entities to links.

```typescript
{
  accessorKey: 'items',
  meta: {
    title: dictionary.entity.fields.items,
  },
  enableSorting: false,
  cell: ({ row }) => {
    return (row.getValue('items') as Array<ItemWithRelationships>)?.map((item) => (
      <div key={item?.id}>
        <ItemLink item={item} className="whitespace-nowrap" />
      </div>
    ));
  },
},
```

### 15. Audit Fields (CreatedBy/UpdatedBy Members)

Uses MemberLink for audit trail display.

```typescript
import { MemberLink } from '@/features/member/components/MemberLink';

// Created by
{
  accessorKey: 'createdByMember',
  meta: {
    title: dictionary.entity.fields.createdByMember,
  },
  enableSorting: false,
  cell: ({ row }) => {
    return <MemberLink member={row.getValue('createdByMember')} />;
  },
},

// Created at
{
  accessorKey: 'createdAt',
  meta: {
    title: dictionary.entity.fields.createdAt,
  },
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {formatDateTime(row.getValue('createdAt'), dictionary)}
    </span>
  ),
},

// Updated by
{
  accessorKey: 'updatedByMember',
  meta: {
    title: dictionary.entity.fields.updatedByMember,
  },
  enableSorting: false,
  cell: ({ row }) => {
    return <MemberLink member={row.getValue('updatedByMember')} />;
  },
},

// Updated at
{
  accessorKey: 'updatedAt',
  meta: {
    title: dictionary.entity.fields.updatedAt,
  },
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {formatDateTime(row.getValue('updatedAt'), dictionary)}
    </span>
  ),
},
```

### 16. Select Column (Row Selection)

Always first column for bulk operations.

```typescript
import { Checkbox } from '@/shared/components/ui/checkbox';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';

{
  id: DataTableColumnIds.select,
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label={dictionary.shared.dataTable.selectAll}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label={dictionary.shared.dataTable.selectRow}
    />
  ),
  enableSorting: false,
  enableHiding: false,
},
```

### 17. Actions Column (Sticky)

Always last column with sticky positioning.

```typescript
{
  id: DataTableColumnIds.actions,
  meta: {
    sticky: true,
  },
  cell: ({ row }) => (
    <EntityActions mode="table" entity={row.original} />
  ),
  enableSorting: false,
  enableHiding: false,
},
```

## Column Definition Summary Table

| Field Type              | Header Align   | Sorting | Cell Render                | Key Import              |
| ----------------------- | -------------- | ------- | -------------------------- | ----------------------- |
| Text                    | left (default) | ✅      | Default or Link            | -                       |
| Integer                 | right          | ✅      | `getValue()`               | `dataTableHeader`       |
| Decimal                 | right          | ✅      | `formatDecimal()`          | `formatDecimal`         |
| Date                    | left           | ✅      | `formatDate()`             | `formatDate`            |
| DateTime                | left           | ✅      | `formatDateTime()`         | `formatDateTime`        |
| Boolean                 | left           | ✅      | `dictionary.shared.yes/no` | -                       |
| Enumerator              | left           | ✅      | `dictionaryEnumerator()`   | `dictionaryEnumerator`  |
| Enumerator Multiple     | left           | ❌      | Map to `<div>`             | `dictionaryEnumerator`  |
| Tags                    | left           | ❌      | Map to `<div>`             | -                       |
| Files                   | left           | ❌      | `<FilesList>`              | `FilesList`             |
| Images                  | left           | ❌      | `<Avatar>`                 | `Avatar`, `downloadUrl` |
| Relationship (single)   | left           | ❌      | `<EntityLink>`             | Entity Link component   |
| Relationship (multiple) | left           | ❌      | Map to `<EntityLink>`      | Entity Link component   |
| Audit (member)          | left           | ❌      | `<MemberLink>`             | `MemberLink`            |
| Audit (timestamp)       | left           | ✅      | `formatDateTime()`         | `formatDateTime`        |

## Related Documentation

- [Entity CRUD Reference](entity-crud-reference.md) - Backend patterns, overview, testing
- [Frontend Form Patterns](frontend-form-patterns.md) - Form component with all field types
- [Frontend View Patterns](frontend-view-patterns.md) - View page and component patterns
