'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Modal from '@/components/ui/Modal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Typography from '@/components/ui/Typography'
import GenericTable, { Badge } from '@/components/admin/data-table/GenericTable'
import MoviesTable from '@/components/admin/data-table/MoviesTable'
import MovieForm from '@/app/admin/movies/MovieForm'
import NewsForm from '@/app/admin/news/NewsForm'
import TheaterForm from '@/app/admin/theaters/TheaterForm'
import ScreenForm from '@/app/admin/screens/ScreenForm'
import ShowtimeForm from '@/app/admin/showtimes/ShowtimeForm'
import {
    useDeleteNewsMutation,
    useDeleteScreenMutation,
    useDeleteShowtimeMutation,
    useDeleteTheaterMutation,
    useGetAdminNewsQuery,
    useGetAdminRoleQuery,
    useGetAdminScreensWithDetailsQuery,
    useGetAdminShowtimesWithDetailsQuery,
    useGetAdminTheatersWithDetailsQuery,
} from '@/lib/features/api/adminApi'
import type { Movie, News, Screen, Showtime, Theater } from '@/types/index'
import type { AdminScreenListItem, AdminShowtimeListItem, AdminTheaterListItem } from '@/actions/adminActions'

type DashboardTab = 'movies' | 'news' | 'theaters' | 'screens' | 'showtimes'

type PendingDelete = {
    entity: DashboardTab
    id: string
    label: string
}

type EditingEntity =
    | { entity: 'movies'; data: Movie }
    | { entity: 'news'; data: News }
    | { entity: 'theaters'; data: Theater }
    | { entity: 'screens'; data: Screen }
    | { entity: 'showtimes'; data: Showtime }

const superAdminTabs: { key: DashboardTab; label: string; addLabel: string; addHref: string }[] = [
    { key: 'movies', label: 'Movies', addLabel: 'Movie', addHref: '/admin/movies' },
    { key: 'news', label: 'News', addLabel: 'News', addHref: '/admin/news' },
]

const theaterAdminTabs: { key: DashboardTab; label: string; addLabel: string; addHref: string }[] = [
    { key: 'theaters', label: 'Theaters', addLabel: 'Theater', addHref: '/admin/theaters' },
    { key: 'screens', label: 'Screens', addLabel: 'Screen', addHref: '/admin/screens' },
    { key: 'showtimes', label: 'Showtimes', addLabel: 'Showtime', addHref: '/admin/showtimes' },
]

function formatDateTime(value: string | null): string {
    if (!value) {
        return '-'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return '-'
    }

    return new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

export default function AdminDashboardPage() {
    const { data: role, isLoading: isRoleLoading } = useGetAdminRoleQuery()
    const isSuperAdmin = role === 'super_admin'
    const isTheaterAdmin = role === 'theater_admin'

    const tabs = useMemo(
        () => (isSuperAdmin ? superAdminTabs : theaterAdminTabs),
        [isSuperAdmin],
    )

    const [selectedTab, setSelectedTab] = useState<DashboardTab>('movies')
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [editingEntity, setEditingEntity] = useState<EditingEntity | null>(null)

    const { data: news = [], isLoading: isNewsLoading } = useGetAdminNewsQuery(undefined, {
        skip: !isSuperAdmin,
    })

    const { data: theaters = [], isLoading: isTheatersLoading } = useGetAdminTheatersWithDetailsQuery(undefined, {
        skip: !isTheaterAdmin,
    })
    const { data: screens = [], isLoading: isScreensLoading } = useGetAdminScreensWithDetailsQuery(undefined, {
        skip: !isTheaterAdmin,
    })
    const { data: showtimes = [], isLoading: isShowtimesLoading } = useGetAdminShowtimesWithDetailsQuery(undefined, {
        skip: !isTheaterAdmin,
    })

    const [deleteNews, { isLoading: isDeletingNews }] = useDeleteNewsMutation()
    const [deleteTheater, { isLoading: isDeletingTheater }] = useDeleteTheaterMutation()
    const [deleteScreen, { isLoading: isDeletingScreen }] = useDeleteScreenMutation()
    const [deleteShowtime, { isLoading: isDeletingShowtime }] = useDeleteShowtimeMutation()

    const isDeleting = isDeletingNews || isDeletingTheater || isDeletingScreen || isDeletingShowtime

    const activeTab = tabs.some((tab) => tab.key === selectedTab) ? selectedTab : tabs[0]?.key ?? 'movies'
    const activeConfig = tabs.find((tab) => tab.key === activeTab)
    const activeTabLabel = activeConfig?.label ?? 'Overview'
    const accessLabel = isSuperAdmin ? 'Super Admin' : isTheaterAdmin ? 'Theater Admin' : 'Admin'
    const theaterRows = theaters as AdminTheaterListItem[]
    const screenRows = screens as AdminScreenListItem[]
    const showtimeRows = showtimes as AdminShowtimeListItem[]

    const onDeleteRequest = (payload: PendingDelete) => {
        setDeleteError(null)
        setPendingDelete(payload)
    }

    const openEditModal = (payload: EditingEntity) => {
        setEditingEntity(payload)
    }

    const handleConfirmDelete = async () => {
        if (!pendingDelete) {
            return
        }

        try {
            if (pendingDelete.entity === 'news') {
                await deleteNews(pendingDelete.id).unwrap()
            }

            if (pendingDelete.entity === 'theaters') {
                await deleteTheater(pendingDelete.id).unwrap()
            }

            if (pendingDelete.entity === 'screens') {
                await deleteScreen(pendingDelete.id).unwrap()
            }

            if (pendingDelete.entity === 'showtimes') {
                await deleteShowtime(pendingDelete.id).unwrap()
            }

            setPendingDelete(null)
            setDeleteError(null)
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                setDeleteError(String(error.message))
                return
            }

            setDeleteError('Failed to delete item')
        }
    }

    const renderTable = () => {
        if (isRoleLoading) {
            return (
                <div className="rounded-3xl border border-shade-200 bg-white px-6 py-10 shadow-sm">
                    <Typography variant="body-medium" color="shade-700" className="font-medium">
                        Loading dashboard...
                    </Typography>
                </div>
            )
        }

        if (isSuperAdmin && activeTab === 'movies') {
            return <MoviesTable onEdit={(movie) => openEditModal({ entity: 'movies', data: movie })} />
        }

        if (isSuperAdmin && activeTab === 'news') {
            return (
                <GenericTable<News>
                    columns={[
                        {
                            key: 'title',
                            header: 'Title',
                            render: (article) => (
                                <Typography variant="body-medium" color="shade-900" className="font-semibold">
                                    {article.title ?? '-'}
                                </Typography>
                            ),
                        },
                        {
                            key: 'category',
                            header: 'Category',
                            render: (article) => <Badge value={article.category ?? 'News'} />,
                        },
                        {
                            key: 'release_date',
                            header: 'Release Date',
                            render: (article) => (
                                <Typography variant="body-medium" color="shade-700">
                                    {formatDateTime(article.release_date)}
                                </Typography>
                            ),
                        },
                    ]}
                    data={news}
                    isLoading={isNewsLoading}
                    getRowId={(article) => article.id}
                    rowLabel={(article) => article.title ?? 'news article'}
                    emptyMessage="No news items found"
                    onEdit={(article) => openEditModal({ entity: 'news', data: article })}
                    onDelete={(article) => onDeleteRequest({ entity: 'news', id: article.id, label: article.title ?? 'news item' })}
                    isDeleting={isDeleting}
                />
            )
        }

        if (isTheaterAdmin && activeTab === 'theaters') {
            return (
                <GenericTable<AdminTheaterListItem>
                    columns={[
                        {
                            key: 'name',
                            header: 'Name',
                            render: (theater) => (
                                <Typography variant="body-medium" color="shade-900" className="font-semibold">
                                    {theater.name}
                                </Typography>
                            ),
                        },
                        {
                            key: 'brand',
                            header: 'Brand',
                            render: (theater) => {
                                const theaterItem = theater as AdminTheaterListItem
                                return <Badge value={theaterItem.brands?.name ?? 'Unassigned'} />
                            },
                        },
                        {
                            key: 'city',
                            header: 'City',
                            render: (theater) => {
                                const theaterItem = theater as AdminTheaterListItem
                                return (
                                    <Typography variant="body-medium" color="shade-700">
                                        {theaterItem.cities?.name ?? '-'}
                                    </Typography>
                                )
                            },
                        },
                    ]}
                    data={theaterRows}
                    isLoading={isTheatersLoading}
                    getRowId={(theater) => theater.id}
                    rowLabel={(theater) => theater.name}
                    emptyMessage="No theaters found"
                    onEdit={(theater) => openEditModal({ entity: 'theaters', data: theater })}
                    onDelete={(theater) => onDeleteRequest({ entity: 'theaters', id: theater.id, label: theater.name })}
                    isDeleting={isDeleting}
                />
            )
        }

        if (isTheaterAdmin && activeTab === 'screens') {
            return (
                <GenericTable<AdminScreenListItem>
                    columns={[
                        {
                            key: 'name',
                            header: 'Name',
                            render: (screen) => (
                                <Typography variant="body-medium" color="shade-900" className="font-semibold">
                                    {screen.name}
                                </Typography>
                            ),
                        },
                        {
                            key: 'theater',
                            header: 'Theater',
                            render: (screen) => {
                                const screenItem = screen as AdminScreenListItem
                                return (
                                    <Typography variant="body-medium" color="shade-700">
                                        {screenItem.theater?.name ?? '-'}
                                    </Typography>
                                )
                            },
                        },
                        {
                            key: 'type',
                            header: 'Type',
                            render: (screen) => {
                                const screenItem = screen as AdminScreenListItem
                                return <Badge value={screenItem.type ?? 'Standard'} />
                            },
                        },
                        {
                            key: 'seats',
                            header: 'Seats',
                            render: (screen) => {
                                const screenItem = screen as AdminScreenListItem
                                return (
                                    <Typography variant="body-medium" color="shade-700">
                                        {screenItem.seat_row && screenItem.seat_col ? `${screenItem.seat_row} x ${screenItem.seat_col}` : '-'}
                                    </Typography>
                                )
                            },
                        },
                    ]}
                    data={screenRows}
                    isLoading={isScreensLoading}
                    getRowId={(screen) => screen.id}
                    rowLabel={(screen) => screen.name}
                    emptyMessage="No screens found"
                    onEdit={(screen) => openEditModal({ entity: 'screens', data: screen })}
                    onDelete={(screen) => onDeleteRequest({ entity: 'screens', id: screen.id, label: screen.name })}
                    isDeleting={isDeleting}
                />
            )
        }

        if (isTheaterAdmin && activeTab === 'showtimes') {
            return (
                <GenericTable<AdminShowtimeListItem>
                    columns={[
                        {
                            key: 'movie',
                            header: 'Movie',
                            render: (showtime) => {
                                const showtimeItem = showtime as AdminShowtimeListItem
                                return (
                                    <Typography variant="body-medium" color="shade-900" className="font-semibold">
                                        {showtimeItem.movies?.name ?? '-'}
                                    </Typography>
                                )
                            },
                        },
                        {
                            key: 'theater',
                            header: 'Theater',
                            render: (showtime) => {
                                const showtimeItem = showtime as AdminShowtimeListItem
                                return (
                                    <Typography variant="body-medium" color="shade-700">
                                        {showtimeItem.theater?.name ?? '-'}
                                    </Typography>
                                )
                            },
                        },
                        {
                            key: 'screen',
                            header: 'Screen',
                            render: (showtime) => {
                                const showtimeItem = showtime as AdminShowtimeListItem
                                return (
                                    <Typography variant="body-medium" color="shade-700">
                                        {showtimeItem.screen?.name ?? '-'}
                                    </Typography>
                                )
                            },
                        },
                        {
                            key: 'show_time',
                            header: 'Show Time',
                            render: (showtime) => {
                                const showtimeItem = showtime as AdminShowtimeListItem
                                return (
                                    <Typography variant="body-medium" color="shade-700">
                                        {formatDateTime(showtimeItem.show_time)}
                                    </Typography>
                                )
                            },
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (showtime) => {
                                const showtimeItem = showtime as AdminShowtimeListItem
                                return <Badge value={showtimeItem.is_active ? 'Active' : 'Inactive'} />
                            },
                        },
                    ]}
                    data={showtimeRows}
                    isLoading={isShowtimesLoading}
                    getRowId={(showtime) => showtime.id}
                    rowLabel={(showtime) => {
                        const showtimeItem = showtime as AdminShowtimeListItem
                        return showtimeItem.movies?.name ?? 'showtime'
                    }}
                    emptyMessage="No showtimes found"
                    onEdit={(showtime) => openEditModal({ entity: 'showtimes', data: showtime as unknown as Showtime })}
                    onDelete={(showtime) => {
                        const showtimeItem = showtime as AdminShowtimeListItem
                        onDeleteRequest({ entity: 'showtimes', id: showtimeItem.id, label: showtimeItem.movies?.name ?? 'showtime' })
                    }}
                    isDeleting={isDeleting}
                />
            )
        }

        return (
            <Typography variant="body-default" color="shade-700">
                No dashboard data available for this role.
            </Typography>
        )
    }

    return (
        <section className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-shade-200 bg-white p-6 shadow-[0_14px_34px_rgba(51,51,51,0.08)] md:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <Typography as="h2" variant="h2" color="shade-900" className="font-bold tracking-[-0.03em]">
                            {activeTabLabel} management made cleaner
                        </Typography>
                        <Typography variant="body-medium" color="shade-700" className="mt-3 max-w-2xl">
                            Manage content from a focused control center with premium tables, modal editing, and clear destructive actions.
                        </Typography>
                    </div>
                </div>

            </div>

            <div className="overflow-hidden rounded-lg border border-shade-200 bg-white p-2 shadow-[0_10px_30px_rgba(51,51,51,0.06)]">
                <div className="flex overflow-x-auto">
                    <div className="inline-flex min-w-max items-center gap-2 rounded-[18px] bg-shade-100 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedTab(tab.key)}
                                className={`rounded-lg px-4 py-2.5 transition-all ${activeTab === tab.key ? 'bg-white shadow-sm ring-1 ring-shade-300' : 'text-shade-600 hover:bg-shade-200/70'
                                    }`}
                            >
                                <Typography
                                    as="span"
                                    variant="body-small"
                                    color={activeTab === tab.key ? 'shade-900' : 'shade-700'}
                                    className="font-semibold uppercase tracking-[0.08em]"
                                >
                                    {tab.label}
                                </Typography>
                            </button>
                        ))}
                    </div>
                    
                </div>
            </div>

            {deleteError ? (
                <div className="rounded-lg border border-sweet-red/30 bg-sweet-red/10 px-4 py-3 shadow-sm">
                    <Typography variant="body-small" color="sweet-red" className="font-semibold">
                        {deleteError}
                    </Typography>
                </div>
            ) : null}

            {renderTable()}

            <Modal
                isOpen={Boolean(editingEntity)}
                title={editingEntity ? `Edit ${editingEntity.entity.slice(0, -1).replace(/^./, (value) => value.toUpperCase())}` : 'Edit Item'}
                onClose={() => setEditingEntity(null)}
            >
                {editingEntity?.entity === 'movies' ? (
                    <MovieForm initialData={editingEntity.data} onSuccess={() => setEditingEntity(null)} />
                ) : null}

                {editingEntity?.entity === 'news' ? (
                    <NewsForm initialData={editingEntity.data} onSuccess={() => setEditingEntity(null)} />
                ) : null}

                {editingEntity?.entity === 'theaters' ? (
                    <TheaterForm initialData={editingEntity.data} onSuccess={() => setEditingEntity(null)} />
                ) : null}

                {editingEntity?.entity === 'screens' ? (
                    <ScreenForm initialData={editingEntity.data} onSuccess={() => setEditingEntity(null)} />
                ) : null}

                {editingEntity?.entity === 'showtimes' ? (
                    <ShowtimeForm initialData={editingEntity.data} onSuccess={() => setEditingEntity(null)} />
                ) : null}
            </Modal>

            <ConfirmModal
                isOpen={Boolean(pendingDelete)}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Item"
                description={pendingDelete ? `Are you sure you want to delete ${pendingDelete.label}? This action cannot be undone.` : ''}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </section>
    )
}
