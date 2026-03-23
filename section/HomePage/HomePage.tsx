import Advertisement from './Advertisement';
import Hero from './Hero';
import News from './News';
import UpcomingMovies from './UpcomingMovies';

export default function HomePage() {

  return (
    <div >
      <Hero/>
      <Advertisement/>
      <News/>
      <UpcomingMovies/>
    </div>
  )
}
