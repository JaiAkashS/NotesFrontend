import {render , screen} from '@testing-library/react'
import Note from './Note'
import { test } from 'vitest'

test('renders content',()=>{
    const note = {
        content:"component testing is the way to go",
        important:true
    }
    render(<Note note={note}/>)
    const element1= screen.getByText("component testing is the way to go")
    const element2 = screen.getByText("does this fail") //fails if the element containing the text is not found 
    // expect(element).toBeDefined() 
    // screen.debug(element) // prints the element
    
}
)