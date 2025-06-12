<template>
    <Container>
        <Card>
            <CardHeader>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>List of available approved vendors</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your recent requests.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[100px]">
                                Vendor
                            </TableHead>
                            <TableHead>Brands</TableHead>
                            <TableHead>Current requests</TableHead>
                            <TableHead class="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="{ name, phone, brands } in vendors">
                            <TableCell class="font-medium">
                                <p>
                                    {{ name }}
                                </p>
                                <p class="text-xs text-slate-500 font-regular">{{ phone }}</p>
                            </TableCell>
                            <TableCell>
                                <div class="gap-4">
                                <span>{{ brands.join(', ') }}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                2 requests
                            </TableCell>
                            
                            <TableCell class="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Ellipsis></Ellipsis>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Send to vendors
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            View offers
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </Container>
</template>
<script lang="ts" setup>
import Container from '@/components/base/container.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader, TableCaption } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-vue-next';
import { useVendorStore } from '@/stores/vendors';
import { computed, onMounted, ref } from 'vue';
const vendorStore = useVendorStore()
const vendors = computed(() => vendorStore.vendors)

onMounted(async () => {
    await vendorStore.getVendors()
})
</script>