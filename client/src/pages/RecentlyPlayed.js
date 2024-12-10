import React, { useEffect, useState } from 'react'
import { Loader, SectionWrapper, TrackItem } from 'src/components'
import { getRecentlyPlayed } from 'src/spotify'
import { StyledTrackList } from 'src/styles'
import { catchErrors } from 'src/util'


const RecentlyPlayed = () => {
    const [recentlyPlayed, setRecentlyPlayed] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getRecentlyPlayed()
            setRecentlyPlayed(data)
        }
        catchErrors(fetchData())
    }, [])

    return (
        <main>
            <SectionWrapper title="Recently Played" breadcrumb={true}>
                {recentlyPlayed && recentlyPlayed.items ? (
                    // <RecentlyPlayedList tracks={recentlyPlayed.items} />
                    <StyledTrackList>
                        {recentlyPlayed.items.map(({ track }, index) => (<TrackItem track={track} key={index} />))}
                    </StyledTrackList>
                ) : (
                    <Loader />
                )}
            </SectionWrapper>
        </main>

    )
}

export default RecentlyPlayed