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
    discount_percent = 0;
    tenmin_rate = 0.17;
    hourly_rate = 0.15;
    dailyplus_rate = 0.14;
    replication_efficiency = 1;

    // CVS-Performance
    var max_tput64kseq_po = {
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

    var max_iops_4kran_po = {
        0: 132000 + 0,
        10: 128000 + 14100,
        20: 124000 + 31000,
        30: 118000 + 50500,
        40: 114000 + 75800,
        50: 107000 + 107000,
        60: 98600 + 147000,
        70: 85300 + 198000,
        80: 64000 + 255000,
        90: 35700 + 319000,
        100: 455000 + 0
    };

    // CVS-Software
    // Not official numbers. Use at own risk.
    var max_tput64kseq_so = {
        0: 0 + 402,
        10: 66 + 388,
        20: 132 + 373, 
        30: 198 + 359,
        40: 264 + 344,
        50: 330 + 330,
        60: 429 + 272,
        70: 527 + 215,
        80: 626 + 157,
        90: 825 + 79,
        100: 1024 + 0
    };

    var max_iops_8kran_so = {
        0: 0 + 18400,
        10: 1860 + 16580,
        20: 3720 + 14760,
        30: 5580 + 12940,
        40: 7440 + 11120,
        50: 9300 + 9300,
        60: 13667 + 8067,
        70: 18033 + 6833,
        80: 22400 + 5600,
        90: 25200 + 2800,
        100: 28000 + 0
    };

    var readpercent = 100 - document.getElementById("ms").value;
    document.getElementById("readtext").innerText = "Read " + readpercent + "%";
    document.getElementById("writetext").innerText = (100 - readpercent) + "% Write";
    cap_target = document.getElementById("capinput").value;
    discount_percent = 1.0 // (100 - document.getElementById("discountinput").value) / 100;
    change_rate = document.getElementById("changerate").value;

    //active_region = document.getElementById("regionselector").value
    swstandard_rate = swstandard_rate * discount_percent;
    swstandardredundant_rate = swstandardredundant_rate * discount_percent;
    standard_rate = standard_rate * discount_percent;
    premium_rate = premium_rate * discount_percent;
    extreme_rate = extreme_rate * discount_percent;

    // GiB/TiB switch
    if (document.getElementById('GiB').checked) {
        volume_in_gb = cap_target * 1;
        cap_unit = "GiB";
        cap_factor = 1;
    } else {
        volume_in_gb = cap_target * 1024;
        cap_unit = "TiB";
        cap_factor = 1024;
    }

    // Performance calculation
    // IOPS calculation assumes that system can deliver IOPS=throughput/block_size, which is massive oversimplification
    max_tput_64_po = max_tput64kseq_po[readpercent];
    max_iops_64_po = (max_tput_64_po * 1024) / 64;
    max_iops_4_po = max_iops_4kran_po[readpercent];
    // If the workload is small random IOPS, throughput will be limited by IOPS capability
    max_tput_4_po = max_iops_4_po * 64 / 1024;

    max_tput_64_so = max_tput64kseq_so[readpercent];
    max_iops_64_so = (max_tput_64_so * 1024) / 64;
    max_iops_8_so = max_iops_8kran_so[readpercent];
      // If the workload is small random IOPS, throughput will be limited by IOPS capability
    max_tput_8_so = max_iops_8_so * 8 / 1024;


    // Reset some fields
    document.getElementById("size_swstandard_cell").classList.remove('text-primary');
    document.getElementById("size_swstandardredundant_cell").classList.remove('text-primary');
    document.getElementById("size_standard_cell").classList.remove('text-primary');
    document.getElementById("size_premium_cell").classList.remove('text-primary');
    document.getElementById("size_extreme_cell").classList.remove('text-primary');
    document.getElementById("capinput").classList.remove('text-danger');
    document.getElementById("capinput").classList.remove('text-primary');

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

        document.getElementById("iops_swstandard_cell_64").innerText = "";
        document.getElementById("iops_swstandardredundant_cell_64").innerText = "";
        document.getElementById("iops_standard_cell_64").innerText = "";
        document.getElementById("iops_premium_cell_64").innerText = "";
        document.getElementById("iops_extreme_cell_64").innerText = "";

        document.getElementById("iops_swstandard_cell_8").innerText = "";
        document.getElementById("iops_swstandardredundant_cell_8").innerText = "";
        document.getElementById("iops_standard_cell_4").innerText = "";
        document.getElementById("iops_premium_cell_4").innerText = "";
        document.getElementById("iops_extreme_cell_4").innerText = "";

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

        document.getElementById("sw_table_unit").innerHTML = "Pool Size <small>(" + cap_unit + ")</small>";
        document.getElementById("table_unit").innerHTML = "Volume Size <small>(" + cap_unit + ")</small>";
        document.getElementById("dest_table_unit").innerHTML = "Volume Size <small>(" + cap_unit + ")</small>";
        document.getElementById("size_swstandard_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("size_swstandardredundant_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("size_standard_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("size_premium_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("size_extreme_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("dest_size_standard_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("dest_size_premium_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("dest_size_extreme_cell").innerText = (volume_in_gb / cap_factor).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        // Performance calculations
        // Throughput caps
        swstandard_tput = (volume_in_gb / 1024) * swstandard_tputpertib;
        if (swstandard_tput > max_tput_64_so) {
            swstandard_tput = max_tput_64_so;
        }
        standard_tput = (volume_in_gb / 1024) * standard_tputpertib;
        if (standard_tput > max_tput_64_po) {
            standard_tput = max_tput_64_po;
        }
        premium_tput = (volume_in_gb / 1024) * premium_tputpertib;
        if (premium_tput > max_tput_64_po) {
            premium_tput = max_tput_64_po;
        }
        extreme_tput = (volume_in_gb / 1024) * extreme_tputpertib;
        if (extreme_tput > max_tput_64_po) {
            extreme_tput = max_tput_64_po;
        }

        // Throughput view
        document.getElementById("tput_swstandard_cell").innerText = swstandard_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("tput_swstandardredundant_cell").innerText = swstandard_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("tput_standard_cell").innerText = standard_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("tput_premium_cell").innerText = premium_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("tput_extreme_cell").innerText = extreme_tput.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        // IOPS view
        // IOPS caps
        // swstandard_tput = (volume_in_gb / 1024) * swstandard_tputpertib;
        // if (swstandard_tput > max_tput_64_so) {
        //     swstandard_tput = max_tput_64_so;
        // }

        iosize = 64
        swstandard_iops64 = (swstandard_tput * 1024) / iosize;
        if (swstandard_iops64 > max_iops_64_so) {
            swstandard_iops64 = max_iops_64_so;
        }
        standard_iops64 = (standard_tput * 1024) / iosize;
        if (standard_iops64 > max_iops_64_po) {
            standard_iops64 = max_iops_64_po;
        }
        premium_iops64 = (premium_tput * 1024) / iosize;
        if (premium_iops64 > max_iops_64_po) {
            premium_iops64 = max_iops_64_po;
        }
        extreme_iops64 = (extreme_tput * 1024) / iosize;
        if (extreme_iops64 > max_iops_64_po) {
            extreme_iops64 = max_iops_64_po;
        }

        iosize = 8
        swstandard_iops8 = (swstandard_tput * 1024) / iosize;   // This is certainly wrong. FIXME
        if (swstandard_iops8 > max_iops_8_so) {
            swstandard_iops8 = max_iops_8_so;
        }
        
        iosize = 4
        standard_iops4 = (standard_tput * 1024) / iosize;
        if (standard_iops4 > max_iops_4_po) {
            standard_iops4 = max_iops_4_po;
        }
        premium_iops4 = (premium_tput * 1024) / iosize;
        if (premium_iops4 > max_iops_4_po) {
            premium_iops4 = max_iops_4_po;
        }
        extreme_iops4 = (extreme_tput * 1024) / iosize;
        if (extreme_iops4 > max_iops_4_po) {
            extreme_iops4 = max_iops_4_po;
        }

        document.getElementById("iops_swstandard_cell_64").innerText = swstandard_iops64.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("iops_swstandardredundant_cell_64").innerText = swstandard_iops64.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("iops_standard_cell_64").innerText = standard_iops64.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("iops_premium_cell_64").innerText = premium_iops64.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("iops_extreme_cell_64").innerText = extreme_iops64.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        document.getElementById("iops_swstandard_cell_8").innerText = swstandard_iops8.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("iops_swstandardredundant_cell_8").innerText = swstandard_iops8.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        iosize = 4
        document.getElementById("iops_standard_cell_4").innerText = standard_iops4.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("iops_premium_cell_4").innerText = premium_iops4.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        document.getElementById("iops_extreme_cell_4").innerText = extreme_iops4.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        // Cost view
        standard_cost = (volume_in_gb * standard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        premium_cost = (volume_in_gb * premium_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        extreme_cost = (volume_in_gb * extreme_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        swstandard_cost = (volume_in_gb * swstandard_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        swstandardredundant_cost = (volume_in_gb * swstandardredundant_rate).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        document.getElementById("cost_swstandard_cell").innerText = swstandard_cost;
        document.getElementById("cost_swstandardredundant_cell").innerText = swstandardredundant_cost;
        document.getElementById("cost_standard_cell").innerText = standard_cost;
        document.getElementById("cost_premium_cell").innerText = premium_cost;
        document.getElementById("cost_extreme_cell").innerText = extreme_cost;
        document.getElementById("dest_cost_standard_cell").innerText = standard_cost;
        document.getElementById("dest_cost_premium_cell").innerText = premium_cost;
        document.getElementById("dest_cost_extreme_cell").innerText = extreme_cost;
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
