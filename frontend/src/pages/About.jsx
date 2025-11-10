import React from 'react'
import { assets } from '../assets/assets'

const About = () => { 
  return (
    <div className="max-w-6xl mx-auto">
     {/* About Us Section */}
      <section className="w-full bg-white py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide text-blue-800">
            ABOUT <span className="text-blue-800">US</span>
            <span className="text-red-600">.</span>
             <div className="w-24 h-1 bg-red-600 mx-auto mt-4 mb-6 rounded-full"></div>
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-700 leading-relaxed text-lg">
          {/* Left Column */}
          <div>
            <p className="mb-6">
              Kano Independent Research Centre Trust is a non-profit
              multi-million dollar Biomedical Research institute established by
              Pfizer Inc. for the Kano State Government to conduct Biomedical
              (and Healthcare) Research with focus on communicable and
              non-communicable diseases of public health importance in Nigeria
              and the African continent.
            </p>
            <button
              onClick={() => navigate("/services")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-all duration-300"
            >
              OUR SERVICES
            </button>
          </div>

          {/* Right Column */}
          <div>
            <p className="mb-6">
              Donors of the project and pharmaceutical giant, Pfizer, built the
              facility to function as both a primary health facility as well as
              a complementary tertiary health facility to the already existing
              health institutions in Kano State. The Centre is administered by a
              board of seven members appointed by Pfizer Inc. and the Kano State
              Government. The board is led by a distinguished Professor of
              Medicine, a Nephrologist, and an Administrator, Prof Aliyu Abdu.
            </p>
            <button
              onClick={() => navigate("/board")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-all duration-300"
            >
              BOARD OF TRUSTEES
            </button>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default About