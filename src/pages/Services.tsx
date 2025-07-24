
import { Navbar } from '../components/Navbar'
import Container from '../components/Container'
import Footer from '../components/Footer'
import { VehiclesListing } from '../components/heros/VehicleHero'

const Services = () => {
  return (
    <>
    <Container className="bg-gradient-to-br from-orange-50 via-amber-50 to-purple-200 flex flex-col gap-6">
     <Navbar/> 
     <VehiclesListing/>
     <Footer/>
     </Container>
    </>
  )
}

export default Services
