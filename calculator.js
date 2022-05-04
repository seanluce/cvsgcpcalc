// var thatslider = document.querySelector("#ms").slider()
// .on('slide', getResults())
// .on('change', getResults());

function getResults() {

    standard_rate = 0.20;
    premium_rate = 0.30;
    extreme_rate = 0.40;
    swstandard_rate = 0.25;
    swstandardredundant_rate = 0.40;
    standard_tputpertib = 16;
    premium_tputpertib = 64;
    extreme_tputpertib = 128;
    swstandard_tputpertib = 128;
    min_vol_capacity = 1024;
    max_vol_capacity = 102400;
    min_tput = 16.0;
    swmax_tput = 1024.0;
    discount_percent = 0;
    tenmin_rate = 0.17;
    hourly_rate = 0.15;
    dailyplus_rate = 0.14;
    replication_efficiency = 1;

    // CVS-Performance
    var max_tput64kseq = {
        0: 0 + 1240,
        10: 134 + 1207,
        20: 299 + 1191,
        30: 505 + 1177,
        40: 783 + 1173,
        50: 1152 + 1154,
        60: 1605 + 1069,
        70: 2011 + 862,
        80: 2406 + 602,
        90: 3015 + 334,
        100: 4500 + 0
    };

    var max_tput8kran = {
        0: 2 * ((132000 + 0) * 4096 / 1024 / 1024).toFixed(0),
        10: 2 * ((128000 + 14100) * 4096 / 1024 / 1024).toFixed(0),
        20: 2 * ((124000 + 31000) * 4096 / 1024 / 1024).toFixed(0),
        30: 2 * ((118000 + 50500) * 4096 / 1024 / 1024).toFixed(0),
        40: 2 * ((114000 + 75800) * 4096 / 1024 / 1024).toFixed(0),
        50: 2 * ((107000 + 107000) * 4096 / 1024 / 1024).toFixed(0),
        60: 2 * ((98600 + 147000) * 4096 / 1024 / 1024).toFixed(0),
        70: 2 * ((85300 + 198000) * 4096 / 1024 / 1024).toFixed(0),
        80: 2 * ((64000 + 255000) * 4096 / 1024 / 1024).toFixed(0),
        90: 2 * ((35700 + 319000) * 4096 / 1024 / 1024).toFixed(0),
        100: 2 * ((455000 + 0) * 4096 / 1024 / 1024).toFixed(0)
    };

    var max_tput4kran = {
        0: 1 * ((132000 + 0) * 4096 / 1024 / 1024).toFixed(0),
        10: 1 * ((128000 + 14100) * 4096 / 1024 / 1024).toFixed(0),
        20: 1 * ((124000 + 31000) * 4096 / 1024 / 1024).toFixed(0),
        30: 1 * ((118000 + 50500) * 4096 / 1024 / 1024).toFixed(0),
        40: 1 * ((114000 + 75800) * 4096 / 1024 / 1024).toFixed(0),
        50: 1 * ((107000 + 107000) * 4096 / 1024 / 1024).toFixed(0),
        60: 1 * ((98600 + 147000) * 4096 / 1024 / 1024).toFixed(0),
        70: 1 * ((85300 + 198000) * 4096 / 1024 / 1024).toFixed(0),
        80: 1 * ((64000 + 255000) * 4096 / 1024 / 1024).toFixed(0),
        90: 1 * ((35700 + 319000) * 4096 / 1024 / 1024).toFixed(0),
        100: 1 * ((455000 + 0) * 4096 / 1024 / 1024).toFixed(0)
    };

    var readpercent = 100 - document.getElementById("ms").value;
    document.getElementById("readtext").innerText = "Read " + readpercent + "%";
    document.getElementById("writetext").innerText = (100 - readpercent) + "% Write";
    cap_target = document.getElementById("capinput").value;
    tput_target = document.getElementById("tputinput").value;
    iops_target = document.getElementById("iopsinput").value;
    discount_percent = 1.0 // (100 - document.getElementById("discountinput").value) / 100;
    change_rate = document.getElementById("changerate").value;

    //active_region = document.getElementById("regionselector").value
    swstandard_rate = swstandard_rate * discount_percent;
    swstandardredundant_rate = swstandardredundant_rate * discount_percent;
    standard_rate = standard_rate * discount_percent;
    premium_rate = premium_rate * discount_percent;
    extreme_rate = extreme_rate * discount_percent;


    if (document.getElementById('TiB').checked) {
        volume_in_gb = cap_target * 1024;
    }

    if (document.getElementById('GiB').checked) {
        volume_in_gb = cap_target * 1;
    }

    // Performance calculation
    // TODO: Fix CVS-SW
    if (document.getElementById("64k_seq").checked) {
        document.getElementById("iosizecell").innerHTML = "IOPS <small>(64KiB Sequential)</small>"
        document.getElementById("swiosizecell").innerHTML = "IOPS <small>(64KiB Sequential)</small>"
        iosize = 64;
        max_tput = max_tput64kseq[readpercent];
        max_iops = (max_tput * 1024) / iosize;
        // document.getElementById("maxtputnote").innerText = max_tput.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        // document.getElementById("maxiopsnote").innerText = ((max_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        //document.getElementById("iopslabel").innerText = "x64KiB"
        if (tput_target > 0 && tput_target > max_tput) {
            //document.getElementById("tputinput").value = max_tput;
            //tput_target = max_tput;
        }
        if (iops_target > 0 && iops_target > max_iops) {
            document.getElementById("iopsinput").value = max_iops;
            iops_target = max_iops;
        }
    } else if (document.getElementById("8k_ran").checked) {
        document.getElementById("iosizecell").innerHTML = "IOPS <small>(8KiB Random)</small>"
        document.getElementById("swiosizecell").innerHTML = "IOPS <small>(8KiB Random)</small>"
        iosize = 8;
        max_tput = max_tput8kran[readpercent];
        max_iops = (max_tput * 1024) / iosize;
        // document.getElementById("maxtputnote").innerText = max_tput.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        // document.getElementById("maxiopsnote").innerText = ((max_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        //document.getElementById("iopslabel").innerText = "x8KiB"
        if (tput_target > 0 && tput_target > max_tput) {
            document.getElementById("tputinput").value = max_tput;
            tput_target = max_tput;
        }
        if (iops_target > 0 && iops_target > max_iops) {
            document.getElementById("iopsinput").value = max_iops;
            iops_target = max_iops;
        }
    } else {
        document.getElementById("iosizecell").innerHTML = "IOPS <small>(4KiB Random)</small>"
        document.getElementById("swiosizecell").innerHTML = "IOPS <small>(4KiB Random)</small>"
        iosize = 4;
        max_tput = max_tput4kran[readpercent];
        max_iops = (max_tput * 1024) / iosize;
        // document.getElementById("maxtputnote").innerText = max_tput.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        // document.getElementById("maxiopsnote").innerText = ((max_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        //document.getElementById("iopslabel").innerText = "x4KiB"
        if (tput_target > 0 && tput_target > max_tput) {
            document.getElementById("tputinput").value = max_tput;
            tput_target = max_tput;
        }
        if (iops_target > 0 && iops_target > max_iops) {
            document.getElementById("iopsinput").value = max_iops;
            iops_target = max_iops;
        }
    }

    // Reset some fields
    document.getElementById("size_swstandard_cell").classList.remove('text-primary');
    document.getElementById("size_swstandardredundant_cell").classList.remove('text-primary');
    document.getElementById("size_standard_cell").classList.remove('text-primary');
    document.getElementById("size_premium_cell").classList.remove('text-primary');
    document.getElementById("size_extreme_cell").classList.remove('text-primary');
    document.getElementById("capinput").classList.remove('text-danger');
    document.getElementById("capinput").classList.remove('text-primary');
    document.getElementById("maxswthroughput").innerText = "Maximum read throughput for Standard-SW is " + swmax_tput +  "MiB/s.";

    // TODO: pools have higher capacity cap than volumes
    if (isNaN(cap_target) || volume_in_gb < min_vol_capacity || volume_in_gb > max_vol_capacity) {
        // Size too big, show empty table
        document.getElementById("capinput").style.borderColor = "red";
        document.getElementById("volumewarning").classList.remove('text-muted');
        document.getElementById("volumewarning").classList.add('text-danger');

        document.getElementById("size_swstandard_cell").innerText = "";
        document.getElementById("size_swstandardredundant_cell").innerText = "";
        document.getElementById("size_standard_cell").innerText = "";
        document.getElementById("size_premium_cell").innerText = "";
        document.getElementById("size_extreme_cell").innerText = "";

        document.getElementById("dest_size_standard_cell").innerText = "";
        document.getElementById("dest_size_premium_cell").innerText = "";
        document.getElementById("dest_size_extreme_cell").innerText = "";

        document.getElementById("tput_swstandard_cell").innerText = "";
        document.getElementById("tput_swstandardredundant_cell").innerText = "";
        document.getElementById("tput_standard_cell").innerText = "";
        document.getElementById("tput_premium_cell").innerText = "";
        document.getElementById("tput_extreme_cell").innerText = "";

        document.getElementById("iops_swstandard_cell").innerText = "";
        document.getElementById("iops_swstandardredundant_cell").innerText = "";
        document.getElementById("iops_standard_cell").innerText = "";
        document.getElementById("iops_premium_cell").innerText = "";
        document.getElementById("iops_extreme_cell").innerText = "";

        document.getElementById("cost_swstandard_cell").innerText = "";
        document.getElementById("cost_swstandardredundant_cell").innerText = "";
        document.getElementById("cost_standard_cell").innerText = "";
        document.getElementById("cost_premium_cell").innerText = "";
        document.getElementById("cost_extreme_cell").innerText = "";

        document.getElementById("dest_cost_standard_cell").innerText = "";
        document.getElementById("dest_cost_premium_cell").innerText = "";
        document.getElementById("dest_cost_extreme_cell").innerText = "";
        change_rate = 0 // Don't show volume replication table
    } else {
        // Correct size, show table
        document.getElementById("capinput").style.borderColor = "lightgray";
        document.getElementById("volumewarning").classList.add('text-muted');
        document.getElementById("volumewarning").classList.remove('text-danger');

        if (isNaN(tput_target) || tput_target < 0 || tput_target > max_tput) {
            // Sizing for throughput
            document.getElementById("tputinput").style.borderColor = "red";
            document.getElementById("tputwarning").classList.add('text-danger');
            document.getElementById("tputwarning").classList.remove('text-muted');

            document.getElementById("size_swstandard_cell").innerText = "";
            document.getElementById("size_swstandardredundant_cell").innerText = "";
            document.getElementById("size_standard_cell").innerText = "";
            document.getElementById("size_premium_cell").innerText = "";
            document.getElementById("size_extreme_cell").innerText = "";

            document.getElementById("dest_size_standard_cell").innerText = "";
            document.getElementById("dest_size_premium_cell").innerText = "";
            document.getElementById("dest_size_extreme_cell").innerText = "";

            document.getElementById("tput_swstandard_cell").innerText = "";
            document.getElementById("tput_swstandardredundant_cell").innerText = "";
            document.getElementById("tput_standard_cell").innerText = "";
            document.getElementById("tput_premium_cell").innerText = "";
            document.getElementById("tput_extreme_cell").innerText = "";

            document.getElementById("iops_swstandard_cell").innerText = "";
            document.getElementById("iops_swstandardredundant_cell").innerText = "";
            document.getElementById("iops_standard_cell").innerText = "";
            document.getElementById("iops_premium_cell").innerText = "";
            document.getElementById("iops_extreme_cell").innerText = "";

            document.getElementById("cost_swstandard_cell").innerText = "";
            document.getElementById("cost_swstandardredundant_cell").innerText = "";
            document.getElementById("cost_standard_cell").innerText = "";
            document.getElementById("cost_premium_cell").innerText = "";
            document.getElementById("cost_extreme_cell").innerText = "";

            document.getElementById("dest_cost_standard_cell").innerText = "";
            document.getElementById("dest_cost_premium_cell").innerText = "";
            document.getElementById("dest_cost_extreme_cell").innerText = "";
        } else {
            document.getElementById("tputinput").style.borderColor = "lightgray";
            document.getElementById("tputwarning").classList.remove('text-danger');
            document.getElementById("tputwarning").classList.add('text-muted');
            if (isNaN(iops_target) || iops_target < 0 || iops_target > max_iops) {
                document.getElementById("iopsinput").style.borderColor = "red";
                document.getElementById("iopswarning").classList.add('text-danger');
                document.getElementById("iopswarning").classList.remove('text-muted');

                document.getElementById("size_swstandard_cell").innerText = "";
                document.getElementById("size_swstandardredundant_cell").innerText = "";
                document.getElementById("size_standard_cell").innerText = "";
                document.getElementById("size_premium_cell").innerText = "";
                document.getElementById("size_extreme_cell").innerText = "";

                document.getElementById("dest_size_standard_cell").innerText = "";
                document.getElementById("dest_size_premium_cell").innerText = "";
                document.getElementById("dest_size_extreme_cell").innerText = "";

                document.getElementById("tput_swstandard_cell").innerText = "";
                document.getElementById("tput_swstandardredundant_cell").innerText = "";
                document.getElementById("tput_standard_cell").innerText = "";
                document.getElementById("tput_premium_cell").innerText = "";
                document.getElementById("tput_extreme_cell").innerText = "";

                document.getElementById("iops_swstandard_cell").innerText = "";
                document.getElementById("iops_swstandardredundant_cell").innerText = "";
                document.getElementById("iops_standard_cell").innerText = "";
                document.getElementById("iops_premium_cell").innerText = "";
                document.getElementById("iops_extreme_cell").innerText = "";

                document.getElementById("cost_swstandard_cell").innerText = "";
                document.getElementById("cost_swstandardredundant_cell").innerText = "";
                document.getElementById("cost_standard_cell").innerText = "";
                document.getElementById("cost_premium_cell").innerText = "";
                document.getElementById("cost_extreme_cell").innerText = "";

                document.getElementById("dest_cost_standard_cell").innerText = "";
                document.getElementById("dest_cost_premium_cell").innerText = "";
                document.getElementById("dest_cost_extreme_cell").innerText = "";

            } else {
                document.getElementById("iopsinput").style.borderColor = "lightgray";
                document.getElementById("iopswarning").classList.remove('text-danger');
                document.getElementById("iopswarning").classList.add('text-muted');

                if (tput_target == 0 && iops_target > 0) {
                    tput_target = (iops_target * iosize) / 1024;
                }
                if (tput_target <= min_tput) {
                    swstandard_tput = (volume_in_gb / 1024) * 128;
                    if (swstandard_tput > max_tput) {
                        swstandard_tput = max_tput;
                    }
                    standard_tput = (volume_in_gb / 1024) * 16;
                    if (standard_tput > max_tput) {
                        standard_tput = max_tput;
                    }
                    premium_tput = (volume_in_gb / 1024) * 64;
                    if (premium_tput > max_tput) {
                        premium_tput = max_tput;
                    }
                    extreme_tput = (volume_in_gb / 1024) * 128;
                    if (extreme_tput > max_tput) {
                        extreme_tput = max_tput;
                    }
                    standard_cost = (volume_in_gb * standard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    premium_cost = (volume_in_gb * premium_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    extreme_cost = (volume_in_gb * extreme_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    swstandard_cost = (volume_in_gb * swstandard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    swstandardredundant_cost = (volume_in_gb * swstandardredundant_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                }
                if (document.getElementById('GiB').checked) {
                    document.getElementById("sw_table_unit").innerHTML = "Volume Size <small>(GiB)</small>";
                    document.getElementById("table_unit").innerHTML = "Volume Size <small>(GiB)</small>";
                    document.getElementById("dest_table_unit").innerHTML = "Volume Size <small>(GiB)</small>";
                    document.getElementById("size_swstandard_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_swstandardredundant_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_standard_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_premium_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_extreme_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("dest_size_standard_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("dest_size_premium_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("dest_size_extreme_cell").innerText = volume_in_gb.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                } else {
                    document.getElementById("sw_table_unit").innerHTML = "Volume Size <small>(TiB)</small>";
                    document.getElementById("table_unit").innerHTML = "Volume Size <small>(TiB)</small>";
                    document.getElementById("dest_table_unit").innerHTML = "Volume Size <small>(TiB)</small>";
                    document.getElementById("size_swstandard_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_swstandardredundant_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_standard_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_premium_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_extreme_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("dest_size_standard_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("dest_size_premium_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("dest_size_extreme_cell").innerText = (volume_in_gb / 1024).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                }
                document.getElementById("tput_swstandard_cell").innerText = swstandard_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("tput_swstandardredundant_cell").innerText = swstandard_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("tput_standard_cell").innerText = standard_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("tput_premium_cell").innerText = premium_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("tput_extreme_cell").innerText = extreme_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                document.getElementById("iops_swstandard_cell").innerText = ((swstandard_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("iops_swstandardredundant_cell").innerText = ((swstandard_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("iops_standard_cell").innerText = ((standard_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("iops_premium_cell").innerText = ((premium_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                document.getElementById("iops_extreme_cell").innerText = ((extreme_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                document.getElementById("cost_swstandard_cell").innerText = swstandard_cost;
                document.getElementById("cost_swstandardredundant_cell").innerText = swstandardredundant_cost;
                document.getElementById("cost_standard_cell").innerText = standard_cost;
                document.getElementById("cost_premium_cell").innerText = premium_cost;
                document.getElementById("cost_extreme_cell").innerText = extreme_cost;
                document.getElementById("dest_cost_standard_cell").innerText = standard_cost;
                document.getElementById("dest_cost_premium_cell").innerText = premium_cost;
                document.getElementById("dest_cost_extreme_cell").innerText = extreme_cost;

                if (tput_target > swmax_tput) {
                    swstandard_size_needed = (swmax_tput / swstandard_tputpertib) * 1024;
                    document.getElementById("tput_swstandard_cell").classList.add('text-danger');
                    document.getElementById("tput_swstandardredundant_cell").classList.add('text-danger');
                    document.getElementById("maxswthroughput").classList.remove('text-muted');
                    document.getElementById("maxswthroughput").classList.add('text-danger');
                } else {
                    swstandard_size_needed = (tput_target / swstandard_tputpertib) * 1024;
                    document.getElementById("tput_swstandard_cell").classList.remove('text-danger');
                    document.getElementById("tput_swstandardredundant_cell").classList.remove('text-danger');
                    document.getElementById("maxswthroughput").classList.remove('text-danger');
                    document.getElementById("maxswthroughput").classList.add('text-muted');
                }
                standard_size_needed = (tput_target / standard_tputpertib) * 1024;
                premium_size_needed = (tput_target / premium_tputpertib) * 1024;
                extreme_size_needed = (tput_target / extreme_tputpertib) * 1024;

                if (swstandard_size_needed < volume_in_gb) {
                    swstandard_size_needed = volume_in_gb
                }
                if (standard_size_needed < volume_in_gb) {
                    standard_size_needed = volume_in_gb
                }
                if (premium_size_needed < volume_in_gb) {
                    premium_size_needed = volume_in_gb
                }
                if (extreme_size_needed < volume_in_gb) {
                    extreme_size_needed = volume_in_gb
                }
                if (document.getElementById('GiB').checked) {
                    document.getElementById("table_unit").innerHTML = "Volume Size <small>(GiB)</small>";
                    swstandard_as_displayed = swstandard_size_needed;
                    standard_as_displayed = standard_size_needed;
                    premium_as_displayed = premium_size_needed;
                    extreme_as_displayed = extreme_size_needed;
                    mincap_as_displayed = min_vol_capacity;
                } else {
                    document.getElementById("table_unit").innerHTML = "Volume Size <small>(TiB)</small>";
                    swstandard_as_displayed = swstandard_size_needed / 1024;
                    standard_as_displayed = standard_size_needed / 1024;
                    premium_as_displayed = premium_size_needed / 1024;
                    extreme_as_displayed = extreme_size_needed / 1024;
                    mincap_as_displayed = min_vol_capacity / 1024;
                }

                if (swstandard_size_needed > max_vol_capacity) {
                    document.getElementById("size_swstandard_cell").innerText = "n/a";
                    document.getElementById("tput_swstandard_cell").innerText = "n/a";
                    document.getElementById("iops_swstandard_cell").innerText = "n/a";
                    document.getElementById("cost_swstandard_cell").innerText = "n/a";
                    document.getElementById("size_swstandardredundant_cell").innerText = "n/a";
                    document.getElementById("tput_swstandardredundant_cell").innerText = "n/a";
                    document.getElementById("iops_swstandardredundant_cell").innerText = "n/a";
                    document.getElementById("cost_swstandardredundant_cell").innerText = "n/a";
                } else if (swstandard_size_needed <= min_vol_capacity) {
                    document.getElementById("size_swstandard_cell").innerText = mincap_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("tput_swstandard_cell").innerText = ((min_vol_capacity / 1024) * swstandard_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("iops_swstandard_cell").innerText = ((((min_vol_capacity / 1024) * swstandard_tputpertib) * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("cost_swstandard_cell").innerText = (min_vol_capacity * swstandard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_swstandardredundant_cell").innerText = mincap_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("tput_swstandardredundant_cell").innerText = ((min_vol_capacity / 1024) * swstandard_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("iops_swstandardredundant_cell").innerText = ((((min_vol_capacity / 1024) * swstandard_tputpertib) * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("cost_swstandardredundant_cell").innerText = (min_vol_capacity * swstandardredundant_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                } else {
                    document.getElementById("size_swstandard_cell").innerText = swstandard_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("size_swstandardredundant_cell").innerText = swstandard_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    if (swstandard_size_needed > volume_in_gb) {
                        document.getElementById("size_swstandard_cell").classList.add('text-primary');
                        document.getElementById("size_swstandardredundant_cell").classList.add('text-primary');
                        document.getElementById("capinput").classList.add('text-primary');
                    }
                    if ((swstandard_size_needed / 1024) * swstandard_tputpertib <= swmax_tput) {
                        document.getElementById("tput_swstandard_cell").innerText = ((swstandard_size_needed / 1024) * swstandard_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("tput_swstandardredundant_cell").innerText = ((swstandard_size_needed / 1024) * swstandard_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_swstandard_cell").innerText = (((swstandard_size_needed / 1024) * swstandard_tputpertib) * 1024 / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_swstandardredundant_cell").innerText = (((swstandard_size_needed / 1024) * swstandard_tputpertib) * 1024 / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    } else {
                        document.getElementById("tput_swstandard_cell").innerText = swmax_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("tput_swstandardredundant_cell").innerText = swmax_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_swstandard_cell").innerText = ((swmax_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_swstandardredundant_cell").innerText = ((swmax_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    }
                    document.getElementById("cost_swstandard_cell").innerText = (swstandard_size_needed * swstandard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("cost_swstandardredundant_cell").innerText = (swstandard_size_needed * swstandardredundant_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                }

                if (standard_size_needed > max_vol_capacity) {
                    document.getElementById("size_standard_cell").innerText = "n/a";
                    document.getElementById("tput_standard_cell").innerText = "n/a";
                    document.getElementById("iops_standard_cell").innerText = "n/a";
                    document.getElementById("cost_standard_cell").innerText = "n/a";
                } else if (standard_size_needed <= min_vol_capacity) {
                    document.getElementById("size_standard_cell").innerText = mincap_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("tput_standard_cell").innerText = ((min_vol_capacity / 1024) * standard_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("iops_standard_cell").innerText = ((((min_vol_capacity / 1024) * standard_tputpertib) * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("cost_standard_cell").innerText = (min_vol_capacity * standard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                } else {
                    document.getElementById("size_standard_cell").innerText = standard_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    if (standard_size_needed > volume_in_gb) {
                        document.getElementById("size_standard_cell").classList.add('text-primary');
                        document.getElementById("capinput").classList.add('text-primary');
                    }
                    if ((standard_size_needed / 1024) * standard_tputpertib <= max_tput) {
                        document.getElementById("tput_standard_cell").innerText = ((standard_size_needed / 1024) * standard_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_standard_cell").innerText = (((standard_size_needed / 1024) * standard_tputpertib) * 1024 / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    } else {
                        document.getElementById("tput_standard_cell").innerText = max_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_standard_cell").innerText = ((max_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    }
                    document.getElementById("cost_standard_cell").innerText = (standard_size_needed * standard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                }
                if (premium_size_needed > max_vol_capacity) {
                    document.getElementById("size_premium_cell").innerText = "n/a";
                    document.getElementById("tput_premium_cell").innerText = "n/a";
                    document.getElementById("iops_premium_cell").innerText = "n/a";
                    document.getElementById("cost_premium_cell").innerText = "n/a";
                    //document.getElementById("poolcost_premium_cell").innerText = "n/a";
                    //document.getElementById("poolsize_premium_cell").innerText = "n/a";
                } else if (premium_size_needed <= min_vol_capacity) {
                    document.getElementById("size_premium_cell").innerText = mincap_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("tput_premium_cell").innerText = ((min_vol_capacity / 1024) * premium_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("iops_premium_cell").innerText = ((((min_vol_capacity / 1024) * premium_tputpertib) * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("cost_premium_cell").innerText = (min_vol_capacity * premium_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    //document.getElementById("poolcost_premium_cell").innerText = (min_pool_capacity * 1024 * premium_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                } else {
                    document.getElementById("size_premium_cell").innerText = premium_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    if (premium_size_needed > volume_in_gb) {
                        document.getElementById("size_premium_cell").classList.add('text-primary');
                        document.getElementById("capinput").classList.add('text-primary');
                    }
                    if ((premium_size_needed / 1024) * premium_tputpertib <= max_tput) {
                        document.getElementById("tput_premium_cell").innerText = ((premium_size_needed / 1024) * premium_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_premium_cell").innerText = (((premium_size_needed / 1024) * premium_tputpertib) * 1024 / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    } else {
                        document.getElementById("tput_premium_cell").innerText = max_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_premium_cell").innerText = ((max_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    }
                    document.getElementById("cost_premium_cell").innerText = (premium_size_needed * premium_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                }
                if (extreme_size_needed > max_vol_capacity) {
                    document.getElementById("size_extreme_cell").innerText = "n/a";
                    document.getElementById("tput_extreme_cell").innerText = "n/a";
                    document.getElementById("iops_extreme_cell").innerText = "n/a";
                    document.getElementById("cost_extreme_cell").innerText = "n/a";
                } else if (extreme_size_needed <= min_vol_capacity) {
                    document.getElementById("size_extreme_cell").innerText = mincap_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("tput_extreme_cell").innerText = ((min_vol_capacity / 1024) * extreme_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("iops_extreme_cell").innerText = ((((min_vol_capacity / 1024) * extreme_tputpertib) * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    document.getElementById("cost_extreme_cell").innerText = (min_vol_capacity * extreme_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                } else {
                    document.getElementById("size_extreme_cell").innerText = extreme_as_displayed.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    if (extreme_size_needed > volume_in_gb) {
                        document.getElementById("size_extreme_cell").classList.add('text-primary');
                        document.getElementById("capinput").classList.add('text-primary');
                    }
                    if ((extreme_size_needed / 1024) * extreme_tputpertib <= max_tput) {
                        document.getElementById("tput_extreme_cell").innerText = ((extreme_size_needed / 1024) * extreme_tputpertib).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_extreme_cell").innerText = (((extreme_size_needed / 1024) * extreme_tputpertib) * 1024 / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    } else {
                        document.getElementById("tput_extreme_cell").innerText = max_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        document.getElementById("iops_extreme_cell").innerText = ((max_tput * 1024) / iosize).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    }
                    document.getElementById("cost_extreme_cell").innerText = (extreme_size_needed * extreme_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                }
            }
        }
    }

    // Volume replication, optional tables
    if (isNaN(change_rate) || change_rate <= 0 || change_rate > 100) {
        document.getElementById("destinationvolume").classList.add("d-none");
        document.getElementById("replicationcost").classList.add("d-none");
        document.getElementById("crrwarning").classList.remove('text-muted');
        document.getElementById("crrwarning").classList.add('text-danger');
        if (change_rate == 0) {
            document.getElementById("crrwarning").classList.remove('text-danger');
            document.getElementById("crrwarning").classList.add('text-muted');
        }
    } else {
        document.getElementById("destinationvolume").classList.remove("d-none");
        document.getElementById("replicationcost").classList.remove("d-none");
        document.getElementById("crrwarning").classList.remove('text-danger');
        document.getElementById("crrwarning").classList.add('text-muted');
        document.getElementById("init_10min_cell").innerText = (volume_in_gb * tenmin_rate * replication_efficiency).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("init_hourly_cell").innerText = (volume_in_gb * hourly_rate * replication_efficiency).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("init_daily_cell").innerText = (volume_in_gb * dailyplus_rate * replication_efficiency).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("inc_10min_cell").innerText = ((((volume_in_gb * (change_rate / 100)) * tenmin_rate * replication_efficiency)) * 30).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("inc_hourly_cell").innerText = ((((volume_in_gb * (change_rate / 100)) * hourly_rate * replication_efficiency)) * 30).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("inc_daily_cell").innerText = ((((volume_in_gb * (change_rate / 100)) * dailyplus_rate * replication_efficiency)) * 30).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("month1_10min_cell").innerText = ((volume_in_gb * tenmin_rate * replication_efficiency) + ((((volume_in_gb * (change_rate / 100)) * tenmin_rate * replication_efficiency)) * 30)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("month1_hourly_cell").innerText = ((volume_in_gb * hourly_rate * replication_efficiency) + ((((volume_in_gb * (change_rate / 100)) * hourly_rate * replication_efficiency)) * 30)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("month1_daily_cell").innerText = ((volume_in_gb * dailyplus_rate * replication_efficiency) + ((((volume_in_gb * (change_rate / 100)) * dailyplus_rate * replication_efficiency)) * 30)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

}
