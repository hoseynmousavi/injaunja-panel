import React, {Component} from 'react'

class CategoryImage extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoaded: null
        }
    }

    componentDidMount()
    {
        let img = new Image()
        img.src = this.props.picture
        img.onload = () =>
        {
            this.setState({...this.state, isLoaded: true})
        }
        img.onerror = () =>
        {
            this.setState({...this.state, isLoaded: false})
        }
    }

    render()
    {
        return <img className={this.state.isLoaded ? 'category-img' : 'category-img-unload'} src={this.props.picture} alt=''/>
    }
}

export default CategoryImage