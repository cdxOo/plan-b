    node tea2dot-test.js > something-graph.dot && xdot something-graph.dot

    # view dot directly
    xdot bla.dot
    
    # convert to svg/png
    dot -T svg bla.dot > bla.svg
    convert -density 300 bla.svg bla.png
