import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader, PlaylistsGrid, SectionWrapper } from 'src/components'
import { getCurrentUserPlaylists } from 'src/spotify'
import { catchErrors } from 'src/util'

const Playlists = () => {
    const [playlistsData, setPlaylistsData] = useState()
    const [playlists, setPlaylists] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getCurrentUserPlaylists()
            setPlaylistsData(data)
        }

        catchErrors(fetchData())
    }, [])

    // When playlistsData updates, check if there are more playlists to fetch
    // then update the state variable
    useEffect(() => {
        if (!playlistsData) {
            return
        }

        // Playlist endpoint only returns 20 playlists at a time, so we need to
        // make sure we get ALL playlists by fetching the next set of playlists
        const fetchMoreData = async () => {
            if (playlistsData.next) {
                const { data } = await axios.get(playlistsData.next)
                setPlaylistsData(data)
            }
        }

        // Use functional update to update playlists state variable
        // to avoid including playlists as a dependency for this hook
        // and creating an infinite loop
        setPlaylists(playlists => ([
            ...playlists ?? [],
            ...playlistsData.items
        ]))

        // Fetch next set of playlists as needed
        catchErrors(fetchMoreData())

    }, [playlistsData])

    return (
        <main>
            <SectionWrapper title="Public Playlists" breadcrumb={true}>
                {playlists ? (
                    <PlaylistsGrid playlists={playlists} />
                ) : (
                    <Loader />
                )}
            </SectionWrapper>
        </main>
    )
}

export default Playlists