import { H2 } from 'components'
import React from 'react'

const AnnotationsListingPlugin = () => {
	return (
		<div className='bg-[#2E3235] w-1/3 rounded-md my-3'>
			<div className='border-b pt-4'>
				<H2 className="text-white">All Annotations</H2>
			</div>
			<div className='p-4'>
				<div className='bg-[#4D4734] border-l-4 border-[#FFBB2E] flex-col rounded-md ml-1 px-4 py-5 mb-4 last:mb-0'>
					<div className='flex'>
						<img src='/assets/Avatar.png' />
						<h5 className='mx-3 my-auto text-white'>Test user ABC</h5>
					</div>
					<h5 className='text-white'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolo elit.</h5>
				</div>
				<div className='bg-[#4D4734] border-l-4 border-transparent flex-col rounded-md ml-1 px-4 py-5'>
					<div className='flex'>
						<img src='/assets/Avatar.png' />
						<h5 className='mx-3 my-auto text-white'>Test user ABC</h5>
					</div>
					<h5 className='text-white'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolo elit.</h5>
				</div>
			</div>
		</div>
	)
}

export default AnnotationsListingPlugin