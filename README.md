# React Touch Slider

A simple, dependency-free, touch enabled slider for React.

RTS is a TypeScript-ready version of [react-slider](https://github.com/Stanko/react-slider) in functional component form. 

[Demo](https://react-touch-slider.netlify.app/)

## Usage

```
import TouchSlider from './TouchSlider'

return (
    <>
        <TouchSlider
            loop={true}
            showNav={true}
            showArrows={true}>
            {someProp.map((x, i) => {
                return <img key={i} src="#" />
            })}
        </TouchSlider>
    </>
)
```

## Options

Options are passed as props.

`loop: false` - Should arrow navigation loop around\
`selected: 0` - Slide to be selected\
`showArrows: true` - Show arrows navigation\
`showNav: true` - Show pager navigation
