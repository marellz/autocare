<template>
    <Container>
        <Card>
            <CardHeader>
                <CardTitle>Requests</CardTitle>
                <CardDescription>X new requests</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your recent requests.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[100px]">
                                Client
                            </TableHead>
                            <TableHead>Requested item</TableHead>
                            <TableHead>Fullfilled</TableHead>
                            <TableHead class="text-right">

                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="request in requests">
                            <TableCell class="font-medium">
                                <p>
                                    {{ request.name }}
                                </p>
                                <p class="text-xs text-slate-500 font-regular">{{ request.phone }}</p>
                            </TableCell>
                            <TableCell>
                                {{ request.item }}
                            </TableCell>
                            <TableCell>
                                2 offers
                            </TableCell>
                            <TableCell>
                                <Badge v-if="request.fulfilled_at">Completed</Badge>
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import Badge from '@/components/ui/badge/Badge.vue';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-vue-next';
import { userRequestService } from '@/services/useRequestService';
import { useRequestStore } from '@/stores/requests.store';
import { computed, onMounted } from 'vue';

const requestService = userRequestService();
const requestStore = useRequestStore()
const requests = computed(() => requestStore.requests)

onMounted(async () => {
    await requestService.getRequests()
});

</script>