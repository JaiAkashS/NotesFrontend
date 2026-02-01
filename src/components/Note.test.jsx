import {render , screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'
import { expect, test } from 'vitest'

test('renders content',async ()=>{
    const note = {
        content:"component testing is the way to go",
        important:true
    }

    const mockHandler = vi.fn()

    render(<Note note={note} toggleImportance={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('make not important')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
    
}
)