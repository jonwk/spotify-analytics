import { useState, useEffect } from 'react';
import { getRecentlyPlayed } from '../spotify';
import { catchErrors } from '../util';
import { SectionWrapper, Loader, TrackItem } from '../components';
import { StyledTrackList } from "../styles";


const RecentlyPlayed = () => {
    const [recentlyPlayed, setRecentlyPlayed] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getRecentlyPlayed();
            setRecentlyPlayed(data);
            console.log(data)
        };
        catchErrors(fetchData());
    }, []);

    return (
        <main>
            <SectionWrapper title="Recently Played" breadcrumb={true}>
                {recentlyPlayed && recentlyPlayed.items ? (
                    // <RecentlyPlayedList tracks={recentlyPlayed.items} />
                    <StyledTrackList>
                        {recentlyPlayed.items.map(({ track }, i) => (<TrackItem track={track} key={i} />))}
                    </StyledTrackList>
                ) : (
                    <Loader />
                )}
            </SectionWrapper>
        </main>

    )
}

export default RecentlyPlayed