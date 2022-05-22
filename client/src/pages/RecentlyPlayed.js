import { useState, useEffect } from 'react';
import { getRecentlyPlayed } from '../spotify';
import { catchErrors } from '../util';
import { SectionWrapper, TrackList, TimeRangeButtons, Loader, RecentlyPlayedList } from '../components';



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
                <div>RecentlyPlayed</div>

                {recentlyPlayed && recentlyPlayed.items ? (
                    <RecentlyPlayedList tracks={recentlyPlayed.items} />
                ) : (
                    <Loader />
                )}
            </SectionWrapper>
        </main>

    )
}

export default RecentlyPlayed