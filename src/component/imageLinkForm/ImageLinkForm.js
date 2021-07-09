import React from 'react';
import './ImageLinkForm.css';
import '../../index.css'

const ImageLinkForm = ({onInputChange,onButtonSubmit}) => {
	return (
		<div>
		  <p className='f3'>
		  	{'This is a Magic Brain will detect your faces in your pictutre. Git it try.'}
		  </p>
		  <div className='center'>
		  	<div className='form center pa4 br3 shadow-5'>
		  	  <input type='text' className=' pa2 w-70 center'onChange= {onInputChange}/>
		  	  <button 
		  	  className='w-30 grow  link ph3 pv2 dib white bg-light-purple'
		  	  onClick = {onButtonSubmit}
		  	  type=''> Detect </button> 
		    </div>
		  </div>
		</div>
	)
}
export default ImageLinkForm;