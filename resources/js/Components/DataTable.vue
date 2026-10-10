<script setup>
import EmptyState from './EmptyState.vue'
import Spinner from './Spinner.vue'

// Columns are `{ key, label }`. Cells render `row[column.key]`; override one
// with a `#cell-<key>="{ row, value }"` slot. Shows a spinner while `loading`
// and an empty state (overridable with the `#empty` slot) when there are no rows.
const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },
  loading: { type: Boolean, default: false },
  emptyTitle: { type: String, default: 'Nothing to show yet' },
})

function keyFor(row, index) {
  const value = row[props.rowKey]
  return typeof value === 'string' || typeof value === 'number' ? value : index
}
</script>

<template>
  <div class="overflow-x-auto">
    <div
      v-if="loading"
      class="flex justify-center p-8"
    >
      <Spinner />
    </div>
    <slot
      v-else-if="rows.length === 0"
      name="empty"
    >
      <EmptyState :title="emptyTitle" />
    </slot>
    <table
      v-else
      class="w-full border-collapse text-sm"
    >
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="border-b border-gray-200 px-3 py-2 text-left font-medium text-gray-600"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="keyFor(row, index)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="border-b border-gray-100 px-3 py-2"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :value="row[column.key]"
            >
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
