import { useEffect, useRef, useState } from 'react';
import './drawChatArea.css'
import { Collapse, EditPencil, Erase, Expand, FillColor, Prohibition } from 'iconoir-react';

let {w, h} = [0, 0];

export default function DrawChatArea() {
    const draw_area = useRef(null);
    const is_drawing = useRef(false);
    const drawing_pos = useRef(null);
    const [cursor_size, setCursorSize] = useState(5);
    const [cursor_color, setCursorColor] = useState("#000000");
    const [selected_tool, setSelectedTool] = useState("pencil");
    const [is_expanded, setIsExpanded] = useState(false);

    function touch_st(eve){
        on_draw_start(eve.touches[0]);
    }
    function touch_ing(eve){
        on_draw(eve.touches[0]);
    }
    function touch_end(){
        on_draw_stop()
    }

    function on_draw_start(eve){
        let canva_pos = draw_area.current.getBoundingClientRect();
        let [x, y] = [Math.floor(eve.clientX - canva_pos.left), Math.floor(eve.clientY - canva_pos.top)]
        drawing_pos.current = {x: x, y: y};
        is_drawing.current = true;

    }
    function on_draw(eve){
        if (!is_drawing.current) return;

        let canva_pos = draw_area.current.getBoundingClientRect();
        let [x, y] = [Math.floor(eve.clientX - canva_pos.left), Math.floor(eve.clientY - canva_pos.top)]
        let ctx = draw_area.current.getContext("2d");
        ctx.lineCap = "round";
        ctx.strokeStyle = selected_tool === "pencil" ? cursor_color : "#ffffff";
        ctx.beginPath();
        ctx.lineWidth = cursor_size;
        ctx.moveTo(drawing_pos.current.x, drawing_pos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        drawing_pos.current.x = x;
        drawing_pos.current.y = y;
    }
    function on_draw_stop(){
        is_drawing.current = false;
    }

    function onPencilSelect(){
        setSelectedTool("pencil");
    }

    function onEreasureSelect(){
        setSelectedTool("eraser");
    }

    function onClearCanvas(){
        let ctx = draw_area.current.getContext("2d")
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, draw_area.current.width, draw_area.current.height);
    }

    function onExpandDrawaArea(){
        setIsExpanded(!is_expanded);
        if (is_expanded === false){
            w = draw_area.current.width;
            h = draw_area.current.height;
            setTimeout(()=>{
                draw_area.current = document.getElementById("draw_area");
                draw_area.current.width = draw_area.current.clientWidth;
                draw_area.current.height = Math.floor(document.documentElement.clientHeight/2);
                let ctx = draw_area.current.getContext("2d")
                ctx.fillStyle = "#ffffff"
                ctx.fillRect(0, 0, draw_area.current.width, draw_area.current.height);
            }, 1);
        }
        else{
            draw_area.current = document.getElementById("draw_area");
            draw_area.current.width = w;
            draw_area.current.height = h;
            let ctx = draw_area.current.getContext("2d")
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, draw_area.current.width, draw_area.current.height);
        }
    }

    useEffect(()=>{
        draw_area.current = document.getElementById("draw_area");
        draw_area.current.width = draw_area.current.clientWidth;
        draw_area.current.height = document.getElementsByClassName("draw_main_body")[0].clientHeight;
        let ctx = draw_area.current.getContext("2d")
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, draw_area.current.width, draw_area.current.height);
    }, []);

  return (
    <div className={`draw_main_body ${is_expanded ? "expanded" : ""}`}>
        <canvas id='draw_area' style={{cursor: selected_tool === "pencil" ? "crosshair" : `auto`}} width={0} height={0} className='drawing_area' onTouchStart={touch_st} onMouseDown={on_draw_start} onTouchMove={touch_ing} onMouseMove={on_draw} onTouchEnd={touch_end} onMouseUp={on_draw_stop} onMouseLeave={on_draw_stop}></canvas>
        <div className='tools'>
            <select onChange={(ele)=>{setCursorSize(ele.target.value)}} value={cursor_size}>
                {Array.from({length: 10}).map((_, idx)=>{
                    return <option value={(idx+1)*2} key={"opt"+idx}>{(idx+1)*2}</option>
                })}
            </select>
            <EditPencil width={25} height={25} className={`icon ${selected_tool === "pencil" ? "selected" : ""}`} onClick={onPencilSelect} />
            <Erase width={25} height={25} className={`icon ${selected_tool === "eraser" ? "selected" : ""}`} onClick={onEreasureSelect} />
            <div className='fill_color'>
                <input onChange={(ele)=>{setCursorColor(ele.target.value)}} type="color" className='color_select' id='color_select'/>
                <FillColor width={25} height={25} className='icon' color={cursor_color} />
            </div>
            <Prohibition width={25} height={25} className='icon' onClick={onClearCanvas} />
            {is_expanded ? 
            <Collapse width={25} height={25} className='icon' onClick={onExpandDrawaArea} />
            :
            <Expand width={25} height={25} className='icon' onClick={onExpandDrawaArea} />
            }
        </div>
    </div>
  )
}
